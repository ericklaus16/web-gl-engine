function initBuffers(gl) {
    const positionBuffer = initPositionBuffer(gl)
    const textureCoordBuffer = initTextureBuffer(gl);
    const indexBuffer = initIndexBuffer(gl)
    const normalBuffer = initNormalBuffer(gl)

    return {
        position: positionBuffer, 
        normal: normalBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer
    }
}

function initPositionBuffer(gl) {
    // Criando um buffer para a posição do quadrado
    const positionBuffer = gl.createBuffer()

    // Seleciona o positionBuffer como o único para aplicar operações de buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    const positions = [
        // Face frontal
        -1.0, -1.0, 1.0, 1.0, 
        -1.0, 1.0, 1.0, 1.0, 
        1.0, -1.0, 1.0, 1.0,

        // Face traseira
        -1.0, -1.0, -1.0, -1.0, 
        1.0, -1.0, 1.0, 1.0, 
        -1.0, 1.0, -1.0, -1.0,

        // Face topo
        -1.0, 1.0, -1.0, -1.0, 
        1.0, 1.0, 1.0, 1.0, 
        1.0, 1.0, 1.0, -1.0,

        // Face de baixo
        -1.0, -1.0, -1.0, 1.0, 
        -1.0, -1.0, 1.0, -1.0, 
        1.0, -1.0, -1.0, 1.0,

        // Face direita
        1.0, -1.0, -1.0, 1.0, 
        1.0, -1.0, 1.0, 1.0, 
        1.0, 1.0, -1.0, 1.0,

        // Face esquerda
        -1.0, -1.0, -1.0, -1.0, 
        -1.0, 1.0, -1.0, 1.0, 
        1.0, -1.0, 1.0, -1.0,
    ]

    // Passa o vetor de posições para o WebGL construir o formato.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    return positionBuffer
}

function initColorBuffer(gl) {
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Face frontal: branco
        [1.0, 0.0, 0.0, 1.0], // Fase traseira: vermelha
        [0.0, 1.0, 0.0, 1.0], // Face do topo: verde
        [0.0, 0.0, 1.0, 1.0], // Face de baixo: azul
        [1.0, 1.0, 0.0, 1.0], // Face da direita: amarela
        [1.0, 0.0, 1.0, 1.0], // Face da esquerda: roxa
    ];

    let colors = []

    for (const c of faceColors){
        colors = colors.concat(c, c, c, c)
    }

    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

    return colorBuffer
}

function initIndexBuffer(gl) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

    /* 
    Esse vetor define cada face como dois triângulos
    usando os indices dentro do array de vertices para
    especificar a posição de cada triângulo
    */

    const indices = [
        0,  1,  2,      0,  2,  3,    // frente
        4,  5,  6,      4,  6,  7,    // tras
        8,  9,  10,     8,  10, 11,   // cima
        12, 13, 14,     12, 14, 15,   // baixo
        16, 17, 18,     16, 18, 19,   // direita
        20, 21, 22,     20, 22, 23,   // esquerda
    ]

    gl.bufferData (
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
    )

    return indexBuffer
}

function initTextureBuffer(gl) {
    const textureCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)

    const textureCoordinates = [
      // Front
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Back
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Top
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Bottom
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Right
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Left
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ]

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      gl.STATIC_DRAW
    )

    return textureCoordBuffer
}

function initNormalBuffer(gl) {
    const normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)

    const vertexNormals = [
        // Frontal
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

        // Traseira
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

        // Cima
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

        // Baixo
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

        // Direita
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

        // Esquerda
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    ]

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexNormals),
        gl.STATIC_DRAW
    )

    return normalBuffer
}

export { initBuffers }