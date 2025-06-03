export class MeshRenderer {
    constructor(gl, buffers, texture) {
        this.gl = gl;
        this.buffers = buffers;
        this.texture = texture;
    }

    render(programInfo, projectionMatrix, viewMatrix, modelMatrix) {
        const gl = this.gl;
        
        // Calcular matrizes
        const modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
        
        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        // Configurar atributos
        this.setVertexAttributes(programInfo);

        // Configurar uniforms
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix
        );

        // Configurar textura
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        // Renderizar
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }

    setVertexAttributes(programInfo) {
        const gl = this.gl;
        const attrs = programInfo.attribLocations;
        
        // Posição
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
        gl.vertexAttribPointer(attrs.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attrs.vertexPosition);
        
        // Textura
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.textureCoord);
        gl.vertexAttribPointer(attrs.textureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attrs.textureCoord);
        
        // Normais
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
        gl.vertexAttribPointer(attrs.vertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attrs.vertexNormal);
    }
}