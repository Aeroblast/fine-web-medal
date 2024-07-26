import { mat3, mat4 } from 'gl-matrix'

export function initWebGL(canvas) {
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return null;
    }
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    //gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);
    return gl;
}
export function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
export function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}
export function getLocation(gl, shaderProgram, attribNames, uniformNames, uniformNames_ext = "") {
    attribNames = attribNames.split(' ')
    uniformNames = uniformNames.split(' ');
    uniformNames_ext = uniformNames_ext.split(' ');
    const programInfo = {
        program: shaderProgram,
        attribLocations: {},
        uniformLocations: {},
        uniformLocations_ext: {},
    };
    attribNames.forEach(x =>
        programInfo.attribLocations[x] = gl.getAttribLocation(shaderProgram, x)
    );
    uniformNames.forEach(x =>
        programInfo.uniformLocations[x] = gl.getUniformLocation(shaderProgram, x)
    );
    uniformNames_ext.forEach(x =>
        programInfo.uniformLocations_ext[x] = gl.getUniformLocation(shaderProgram, x)
    );
    return programInfo;
}


/** @param {WebGLRenderingContext} gl  */
export function setGLBuffers(gl, model) {
    model.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.vertex, gl.STATIC_DRAW);

    model.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.normal, gl.STATIC_DRAW);

    model.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indices, gl.STATIC_DRAW);
}

/** @param {WebGLRenderingContext} gl  */
export function drawScene(gl, projectionMatrix, objects, deltaTime) {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (const obj of objects) {
        for (const part of obj.parts) {
            gl.useProgram(part.programInfo.program);
            gl.bindBuffer(gl.ARRAY_BUFFER, part.geomertry.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, part.geomertry.indexBuffer);
            gl.enableVertexAttribArray(
                part.programInfo.attribLocations["aVertexPosition"]);
            gl.vertexAttribPointer(
                part.programInfo.attribLocations["aVertexPosition"],
                3,//numComponents
                gl.FLOAT,
                false,//normalize
                0,//stride
                0// offset
            );
            gl.bindBuffer(gl.ARRAY_BUFFER, part.geomertry.normalBuffer);
            gl.enableVertexAttribArray(
                part.programInfo.attribLocations["aVertexNormal"]);
            gl.vertexAttribPointer(
                part.programInfo.attribLocations["aVertexNormal"],
                3,//numComponents
                gl.FLOAT,
                false,//normalize
                0,//stride
                0// offset
            );


            gl.uniformMatrix4fv(
                part.programInfo.uniformLocations.uProjectionMatrix,
                false,
                projectionMatrix);
            gl.uniformMatrix4fv(
                part.programInfo.uniformLocations.uModelViewMatrix,
                false,
                obj.view);


            const normalMatrix = mat3.create();

            mat3.normalFromMat4(normalMatrix, obj.view);
            gl.uniformMatrix3fv(
                part.programInfo.uniformLocations.uNormalMatrix,
                false,
                normalMatrix);


            for (const ext_name in part.programInfo.uniformLocations_ext) {
                const ext = part.programInfo.uniformLocations_ext[ext_name]
                const x = part[ext_name];
                gl[x.func](
                    ext,
                    x.v
                );
            }

            if (part.programInfo.uniformLocations.uSampler !== undefined) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, part.texture);
                gl.uniform1i(part.programInfo.uniformLocations.uSampler, 0);
            }


            const vertexCount = part.geomertry.indices.length;

            const offset = 0;
            gl.drawElements(gl.TRIANGLES,
                vertexCount,
                gl.UNSIGNED_SHORT,
                offset);

        }//for parts
    }//for objs

}


