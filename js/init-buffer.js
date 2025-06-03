function initBuffers(gl) {
    const positionBuffer = initPositionBuffer(gl)
    const colorBuffer = initColorBuffer(gl)

    return {
        position: positionBuffer, 
        color: colorBuffer 
    }
}

function initPositionBuffer(gl) {
    // Criando um buffer para a posição do quadrado
    const positionBuffer = gl.createBuffer()

    // Seleciona o positionBuffer como o único para aplicar operações de buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    const positions = [
        1.0, 1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, -1.0
    ]

    // Passa o vetor de posições para o WebGL construir o formato.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    return positionBuffer
}

function initColorBuffer(gl) {
    const colors = [
        1.0, 1.0, 1.0, 1.0, // branco
        1.0, 0.0, 0.0, 1.0, // vermelho,
        0.0, 1.0, 0.0, 1.0, // verde,
        0.0, 0.0, 1.0, 1.0, // azul
    ]

    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

    return colorBuffer
}

export { initBuffers }