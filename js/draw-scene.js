function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clearDepth(1.0) // Limpar tudo
    gl.enable(gl.DEPTH_TEST) 
    gl.depthFunc(gl.LEQUAL) // Coisas próximas "obscurecem" coisas longe

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    /*
    Criando a matriz perspectiva, 
    com fov de 45 graus, 
    com um limite de visão [0.1, 100]
    */
    const fieldOfView = (45 * Math.PI) / 180
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
    const zNear = 0.1
    const zFar = 100
    const projectionMatrix = mat4.create()

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)
    
    // Definindo a posição de desenho para o ponto identidade (centro da cena)
    const modelViewMatrix = mat4.create();

    // Mover a posição de desenho para aonde desejamos desenhar o quadrado
    mat4.translate(
        modelViewMatrix, // matriz destino
        modelViewMatrix, // matriz de translado
        [-0.0, 0.0, -6.0]
    ) // Quantia de translado

    // Diz ao WebGl como colocar as posições do buffer de posições no vertexPosition 
    setPositionAttribute(gl, buffers, programInfo)

    gl.useProgram(programInfo.program)

    // Seta os shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    )
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    )

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
    }
}

function setPositionAttribute(gl, buffers, programInfo){
    const numComponents = 2; // 2 valores por iteração
    const type = gl.FLOAT // Os dados no buffer são float 32 bits
    const normalize = false // Não normaliza
    const stride = 0 // quantos bytes pegar de um set de valores para o próximo
    const offset = 0 // quantos bytes de dentro do buffer deve se começar com

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    )

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
}

export { drawScene  }