function drawScene(gl, programInfo, buffers, texture, cubeRotation) {
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

    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation,
        [0, 0, 1]
    ) // rotaciona no eixo Z

    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation * 0.7,
        [0, 1, 0]
    ) // rotaciona no eixo Y

    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation * 0.3,
        [1, 0, 0]
    ) // rotaciona no eixo X

    const normalMatrix = mat4.create()
    mat4.invert(normalMatrix, modelViewMatrix)
    mat4.transpose(normalMatrix, normalMatrix)

    // Diz ao WebGl como colocar as posições do buffer de posições no vertexPosition 
    setPositionAttribute(gl, buffers, programInfo)
    setTextureAttribute(gl, buffers, programInfo)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

    setNormalAttribute(gl, buffers, programInfo)

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
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix
    )

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
    }
}

function setPositionAttribute(gl, buffers, programInfo){
    const numComponents = 3; // 3 valores por iteração (3D)
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

function setColorAttribute(gl, buffers, programInfo) {
    const numComponents = 4; 
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
    )

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
}

function setNormalAttribute(gl, buffers, programInfo) {
    const numComponents = 3
    const type = gl.FLOAT
    const normalize = false
    const stride = 0 
    const offset = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal)
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset
    )

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal)
}

function setTextureAttribute(gl, buffers, programInfo) {
  const num = 2
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord)
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset
  )

  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord)
}

export { drawScene }