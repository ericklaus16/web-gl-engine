import { Transform } from '../components/Transform.js';
import { MeshRenderer } from '../components/MeshRenderer.js';

export class GameObject {
    constructor(gl, buffers, texture) {
        this.transform = new Transform();
        this.renderer = new MeshRenderer(gl, buffers, texture);
    }

    update(deltaTime) {
        this.transform.rotation[0] += deltaTime * 0.3;
        this.transform.rotation[1] += deltaTime * 0.7;
        this.transform.rotation[2] += deltaTime;
        this.transform.update();
    }

    render(programInfo, projectionMatrix, viewMatrix) {
        this.renderer.render(
            programInfo,
            projectionMatrix,
            viewMatrix,
            this.transform.matrix
        );
    }
}