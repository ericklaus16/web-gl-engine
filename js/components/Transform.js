export class Transform {
    constructor() {
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.matrix = mat4.create();
    }

    update() {
        mat4.identity(this.matrix);
        mat4.translate(this.matrix, this.matrix, this.position);
        mat4.rotateZ(this.matrix, this.matrix, this.rotation[2]);
        mat4.rotateY(this.matrix, this.matrix, this.rotation[1]);
        mat4.rotateX(this.matrix, this.matrix, this.rotation[0]);
        mat4.scale(this.matrix, this.matrix, this.scale);
    }
}