import { initBuffers } from '../init-buffer.js';
import { GameObject } from './GameObject.js';
import { ShaderManager } from './ShaderManager.js';
import { TextureLoader } from './TextureLoader.js';
import * as shaders from '../resources/shaders.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.programInfo = null;
        this.sceneObjects = [];
        this.lastTime = 0;
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.fpsDisplayElement = document.querySelector("#fpsDisplay")
    }

    async init() {
        this.initWebGLContext();
        this.initShaders();
        await this.initResources();
        this.initScene();
        this.initEventListeners();
    }

    initWebGLContext() {
        this.gl = this.canvas.getContext("webgl", { 
            antialias: false, 
            powerPreference: "high-performance" 
        }) || this.canvas.getContext("experimental-webgl");

        if (!this.gl) throw new Error("WebGL não suportado");

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
    }

    initShaders() {
        const shaderProgram = ShaderManager.initShaderProgram(
            this.gl,
            shaders.vertex,
            shaders.fragment
        );
        
        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                vertexNormal: this.gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                textureCoord: this.gl.getAttribLocation(shaderProgram, "aTextureCoord"),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                normalMatrix: this.gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
                uSampler: this.gl.getUniformLocation(shaderProgram, "uSampler"),
            },
        };
    }

    async initResources() {
        this.cubeBuffers = initBuffers(this.gl);
        this.texture = await TextureLoader.load(this.gl, "cubetexture.png");
    }

    initScene() {
        const cube = new GameObject(this.gl, this.cubeBuffers, this.texture);
        cube.transform.position = [-4, 0, -6];
        this.sceneObjects.push(cube);
        
        const newCube = new GameObject(this.gl, this.cubeBuffers, this.texture);
        newCube.transform.position = [2, 0, -6];
        newCube.transform.scale = [0.5, 0.5, 0.5];
        this.sceneObjects.push(newCube);

    }

    initEventListeners() {
        window.addEventListener('resize', () => this.updateProjectionMatrix());
        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        const fieldOfView = (45 * Math.PI) / 180;
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        mat4.perspective(this.projectionMatrix, fieldOfView, aspect, 0.1, 100);
    }

    start() {
        this.lastTime = performance.now();
        this.render();
    }

    render() {
        const now = performance.now();
        const deltaTime = (now - this.lastTime) * 0.001;
        this.lastTime = now;

        this.updateFPS(deltaTime);
        this.updateScene(deltaTime);
        this.renderScene();

        requestAnimationFrame(() => this.render());
    }

    updateFPS(deltaTime) {
        if (this.fpsDisplayElement) {
            this.fpsDisplayElement.innerHTML = `FPS: ${Math.round(1 / deltaTime)}`;
        }
    }

    updateScene(deltaTime) {
        for (const obj of this.sceneObjects) {
            obj.update(deltaTime);
        }
    }

    renderScene() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.useProgram(this.programInfo.program);

        // Configurar view matrix (câmera)
        mat4.identity(this.viewMatrix);
        mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, -10]);

        // Renderizar objetos
        for (const obj of this.sceneObjects) {
            obj.render(
                this.programInfo,
                this.projectionMatrix,
                this.viewMatrix
            );
        }
    }
}