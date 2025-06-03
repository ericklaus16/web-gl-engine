import { initBuffers } from "./init-buffer.js";
import { drawScene } from "./draw-scene.js";

main();

function main() {
    const canvas = document.querySelector("#canvas")
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
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aVertexColor;
        }
    `

    // Fragment shader -> associa qual cor vai a qual pixel
    const fsSource = `
        varying lowp vec4 vColor;

        void main() {
            gl_FragColor = vColor;
        }
    `

    // Inicializando o shader do programa, aqui é onde a iluminação dos vértices é feita
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix")
        },
    }

    // Constrói todos os objetos que forem desenhados
    const buffers = initBuffers(gl)

    drawScene(gl, programInfo, buffers)
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