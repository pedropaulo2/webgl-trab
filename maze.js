// maze.js

function createMaze() {
    const mazeWidth = 10;
    const mazeHeight = 10;
    const cellSize = 1.0;
    const maze = [];

    // Definindo o labirinto como uma matriz de 1s e 0s (1: parede, 0: caminho)
    for (let y = 0; y < mazeHeight; y++) {
        maze[y] = [];
        for (let x = 0; x < mazeWidth; x++) {
            maze[y][x] = Math.random() > 0.3 ? 0 : 1; // Mais caminho do que parede
        }
    }

    // Garantir que a entrada e a saída estejam sempre livres
    maze[0][0] = 0;
    maze[mazeHeight - 1][mazeWidth - 1] = 0;

    return { maze, cellSize };
}

function drawMaze() {
    const { maze, cellSize } = createMaze();
    const numRows = maze.length;
    const numCols = maze[0].length;

    // Configura a matriz de modelo para o labirinto
    const modelMatrix = mat4.create();
    mat4.identity(modelMatrix);

    // Envia a matriz de modelo para o shader
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (maze[row][col] === 1) {
                // Define a posição do cubo
                const x = col * cellSize;
                const y = 0; // altura do labirinto (fixa)
                const z = row * cellSize;
                
                // Configura a matriz de modelo para o cubo
                const cubeModelMatrix = mat4.create();
                mat4.translate(cubeModelMatrix, cubeModelMatrix, [x, y, z]);

                // Envia a matriz de modelo para o shader
                gl.uniformMatrix4fv(modelMatrixLocation, false, cubeModelMatrix);
                
                // Desenha o cubo
                drawCube(x, y, z, cellSize);
            }
        }
    }
}

function drawCube(x, y, z, size) {
    const halfSize = size / 2;

    // Define os vértices do cubo
    const vertices = new Float32Array([
        // Frente
        x - halfSize, y - halfSize, z + halfSize,
        x + halfSize, y - halfSize, z + halfSize,
        x + halfSize, y + halfSize, z + halfSize,
        x - halfSize, y + halfSize, z + halfSize,

        // Trás
        x - halfSize, y - halfSize, z - halfSize,
        x + halfSize, y - halfSize, z - halfSize,
        x + halfSize, y + halfSize, z - halfSize,
        x - halfSize, y + halfSize, z - halfSize,

        // Topo
        x - halfSize, y + halfSize, z - halfSize,
        x + halfSize, y + halfSize, z - halfSize,
        x + halfSize, y + halfSize, z + halfSize,
        x - halfSize, y + halfSize, z + halfSize,

        // Fundo
        x - halfSize, y - halfSize, z - halfSize,
        x + halfSize, y - halfSize, z - halfSize,
        x + halfSize, y - halfSize, z + halfSize,
        x - halfSize, y - halfSize, z + halfSize,

        // Lado esquerdo
        x - halfSize, y - halfSize, z - halfSize,
        x - halfSize, y + halfSize, z - halfSize,
        x - halfSize, y + halfSize, z + halfSize,
        x - halfSize, y - halfSize, z + halfSize,

        // Lado direito
        x + halfSize, y - halfSize, z - halfSize,
        x + halfSize, y + halfSize, z - halfSize,
        x + halfSize, y + halfSize, z + halfSize,
        x + halfSize, y - halfSize, z + halfSize,
    ]);

    // Define os índices dos vértices para desenhar o cubo
    const indices = new Uint16Array([
        0, 1, 2, 0, 2, 3, // Frente
        4, 5, 6, 4, 6, 7, // Trás
        8, 9, 10, 8, 10, 11, // Topo
        12, 13, 14, 12, 14, 15, // Fundo
        16, 17, 18, 16, 18, 19, // Lado esquerdo
        20, 21, 22, 20, 22, 23, // Lado direito
    ]);

    // Cria o buffer para os vértices e os índices
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Habilita os atributos dos vértices
    const positionLocation = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // Desenha o cubo
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

