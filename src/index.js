import { mat4 } from 'gl-matrix'

import { getLocation, initWebGL, initShaderProgram, setGLBuffers, drawScene } from './basicGL'

import { createMedalInner, createMedalOuter } from './createGeometry'

import fragSrc_basic from './shaders/basic.frag.glsl'
import vertSrc_basic from './shaders/basic.vert.glsl'

import fragSrc_plane from './shaders/plane.frag.glsl'
import vertSrc_plane from './shaders/plane.vert.glsl'

import { initShowMedal, showMedal } from './showMedal'



let canvas;
/** @type WebGLRenderingContext */
let gl;
let settings;
const textures = {};//access by name
const medals = {};//access by id
let createMedal;


export async function init(_settings) {
    settings = _settings;

    canvas = document.querySelector(settings.canvas_selector);

    gl = initWebGL(canvas);
    if (!gl) {
        return;
    }
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

    // 公用几何图形
    const geo_MedalOuter = createMedalOuter();//外环+背面
    const geo_MedalInner = createMedalInner();//贴图处
    setGLBuffers(gl, geo_MedalOuter);
    setGLBuffers(gl, geo_MedalInner);
    function createMedal_basic(texture, baseColor) {
        const modelViewMatrix = mat4.create()
        return {
            view: modelViewMatrix,
            parts: [
                {
                    programInfo: programInfo_basic,
                    geomertry: geo_MedalOuter,
                    uBaseColor: { func: "uniform3fv", v: baseColor }
                },
                {
                    programInfo: programInfo_plane,
                    geomertry: geo_MedalInner,
                    texture: texture,
                    uInverseRadius: { func: "uniform1f", v: 1 / geo_MedalInner.vertex[0] }
                }
            ]
        }
    }


    createMedal = async function (param) {
        let texture;
        if (param.texture) {
            texture = await getTexture(param.texture);// get by name
        }
        switch (param.type) {
            case "basic":
                return createMedal_basic(texture, param.baseColor);
        }
    }
    initShowMedal(canvas, gl);
}

export async function getPreviews(selector, id_list) {
    const div = document.querySelector(selector);
    div.innerHTML = "";
    for (const id of id_list) {
        let obj = medals[id];
        if (!obj) {
            medals[id] = await createMedal(settings.medals[id]);
            obj = medals[id];
        }
        console.log(obj)
        let preview = obj.preview
        if (!preview) {
            showMedal(gl, obj, false, 0);
            await nextFrame();
            obj.preview = await canvasToBlobUrl(canvas);
            preview = obj.preview;
        }

        const container = document.createElement("div");
        container.setAttribute("data-id", id);
        let img = new Image()
        img.src = preview;
        container.appendChild(img);
        div.appendChild(container);
    }
}
export async function showById(id) {

}



async function loadImage(src) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

async function getTexture(name) {
    const t = textures[name];
    if (t) {
        return t;
    }
    const img = await loadImage(name + settings.textureExt);
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
        img,
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    textures[name] = texture;
    return texture;
}

async function canvasToBlobUrl(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                resolve(url);
            } else {
                reject(new Error('Canvas toBlob failed.'));
            }
        });
    });
}

async function nextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(resolve);
    });
}