
/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {HTMLImageElement} img 
 */
export async function createCubeMapFromSingle(gl, img) {
    const pieceSize = img.naturalHeight / 3;
    if (img.naturalWidth / 4 != pieceSize) {
        throw `Invaild CubeMap Source: ${img.naturalWidth}x${img.naturalHeight}`;
    }
    /*
        [+Y]
    [-X][+Z][+X][-Z]
        [-Y]
     */
    const cubeMapSrcPos = [
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, row: 1, col: 2 },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, row: 1, col: 0 },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, row: 0, col: 1 },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, row: 2, col: 1 },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, row: 1, col: 1 },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, row: 1, col: 3 },
    ];
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = pieceSize;
    ctx.canvas.height = pieceSize;

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    const level = 0;
    const internalFormat = gl.RGB;
    const srcFormat = gl.RGB;
    const srcType = gl.UNSIGNED_BYTE;
    for (const info of cubeMapSrcPos) {
        const { target, row, col } = info;

        ctx.drawImage(img, col * pieceSize, row * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize)

        gl.texImage2D(
            target,
            level,
            internalFormat,
            srcFormat,
            srcType,
            ctx.canvas,
        );
    }
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    return texture;
}