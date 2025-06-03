import { initBuffers } from "./init-buffer.js";
import { drawScene } from "./draw-scene.js";

let cubeRotation = 0.0
let deltaTime = 0

const fpsDisplayElement = document.querySelector("#fpsDisplay")

main();

function main() {
    const canvas = document.querySelector("#canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const gl = canvas.getContext("webgl")

    if(!gl) {
        alert ("Não foi possível inicializar o WebGL. Seu navegador ou máquina talvez não suporte.")
        return
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;

        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;

            // Aplicar iluminação
            highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
            highp vec3 directionalLightColor = vec3(1, 1, 1);
            highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
        }
    `

    // Fragment shader -> associa qual cor vai a qual pixel
    const fsSource = `
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        uniform sampler2D uSampler;

        void main(void) {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

            gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
        }
    `

    // Inicializando o shader do programa, aqui é onde a iluminação dos vértices é feita
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
        textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
            shaderProgram,
            "uProjectionMatrix"
        ),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
        uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
        },
    }

    // Constrói todos os objetos que forem desenhados
    const buffers = initBuffers(gl)

    // Carregar textura
    const texture = loadTexture(gl, "cubetexture.png");
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


    let then = 0

    function render(now){
        now *= 0.001; // convertendo para segundos
        deltaTime = now - then
        then = now

        const fps = 1 / deltaTime;

        if (fpsDisplayElement) {
            fpsDisplayElement.innerHTML = `FPS: ${fps.toFixed(0)}`
        }

        drawScene(gl, programInfo, buffers, texture, cubeRotation)
        cubeRotation += deltaTime

        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}   

// Inicializando um shader program, para que o WebGl saiba como desenhar os dados
function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    // Criando o shader program

    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert (`Ocorreu um erro ao inicalizar o shader program: ${gl.getProgramInfoLog(shaderProgram)}`)
        return null;
    }

    return shaderProgram
}   

function loadShader(gl, type, source){
    const shader = gl.createShader(type)

    // Enviando o shader ao destino
    gl.shaderSource(shader, source)

    // Compilando o shader
    gl.compileShader(shader)

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert (`Ocorreu um erro ao compilar os shaders: ${gl.getShaderInfoLog(shader)}`)
        gl.deleteShader(shader)
        return null
    }

    return shader;
}

function loadTexture(gl, url) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE
  const pixel = new Uint8Array([0, 0, 255, 255]) // azul opaco

  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
  }
  image.src = url

  return texture
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}