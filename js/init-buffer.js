function initBuffers(gl){
    const positionBuffer = initPositionBuffer(gl)

    return { position: positionBuffer }
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

export { initBuffers }