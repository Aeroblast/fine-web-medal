import { mat4 } from 'gl-matrix'

import { getLocation, initWebGL, initShaderProgram, setGLBuffers, drawScene } from './basicGL'

import { createMedalInner, createMedalOuter } from './createGeometry'

import fragSrc_basic from './shaders/basic.frag.glsl'
import vertSrc_basic from './shaders/basic.vert.glsl'

import fragSrc_plane from './shaders/plane.frag.glsl'
import vertSrc_plane from './shaders/plane.vert.glsl'

const canvas_selector = "canvas";

const obj_base_pos = [-0.0, 0.0, -6.0];


const texture_names = ["test"]

async function main() {

    const canvas = document.querySelector(canvas_selector);
    /** @type WebGLRenderingContext */
    const gl = initWebGL(canvas);
    if (!gl) {
        return;
    }
    const texture_loads = texture_names.map(async name => {
        const img = await loadImage(name + ".jpg");
        return { img, name }
    });
    const texture_infos = await Promise.all(texture_loads);

    const textures = {};
    texture_infos.forEach(info => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const level = 0;
        const internalFormat = gl.RGB;
        const srcFormat = gl.RGB;
        const srcType = gl.UNSIGNED_BYTE;

        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            info.img,
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        textures[info.name] = texture;
    });

    const shadarProgram_basic = initShaderProgram(gl, vertSrc_basic, fragSrc_basic);
    const programInfo_basic = getLocation(gl,
        shadarProgram_basic,
        "aVertexPosition aVertexNormal",
        "uModelViewMatrix uProjectionMatrix uNormalMatrix",
        "uBaseColor"
    );

    const shadarProgram_plane = initShaderProgram(gl, vertSrc_plane, fragSrc_plane);
    const programInfo_plane = getLocation(gl,
        shadarProgram_plane,
        "aVertexPosition aVertexNormal",
        "uSampler uModelViewMatrix uProjectionMatrix uNormalMatrix",
        "uInverseRadius"
    );

    // to-do公用几何图形
    const geo_MedalOuter = createMedalOuter();//外环+背面
    const geo_MedalInner = createMedalInner();//贴图处
    setGLBuffers(gl, geo_MedalOuter);
    setGLBuffers(gl, geo_MedalInner);
    function createMetal() {
        const modelViewMatrix = mat4.create()
        mat4.translate(modelViewMatrix, modelViewMatrix, obj_base_pos);
        return {
            view: modelViewMatrix,
            parts: [
                {
                    programInfo: programInfo_basic,
                    geomertry: geo_MedalOuter,
                    uBaseColor: { func: "uniform3fv", v: [0.3, 0.7, 0] }
                },
                {
                    programInfo: programInfo_plane,
                    geomertry: geo_MedalInner,
                    texture: textures["test"],
                    uInverseRadius: { func: "uniform1f", v: 1/geo_MedalInner.vertex[0] }
                }
            ]
        }
    }


    const objects = [
        createMetal()
    ];
    console.log(objects)

    // Fixed camera
    const projectionMatrix = mat4.create();
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    let rotationAngle = 0;
    let then = 0;
    function update(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;
        rotationAngle += deltaTime * 0.9;

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, obj_base_pos);

        mat4.rotateY(modelViewMatrix, modelViewMatrix, rotationAngle);
        for (const obj of objects) {
            obj.view = modelViewMatrix;
        }

        drawScene(gl, projectionMatrix, objects, deltaTime);

        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

window.addEventListener('load', main);



async function loadImage(src) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}