import { mat4 } from 'gl-matrix'

import { getLocation, initWebGL, initShaderProgram, setGLBuffers, drawScene } from './basicGL'

import { createMedalInner, createMedalOuter, createCirclePlane } from './createGeometry'

import fragSrc_basic from './shaders/basic.frag.glsl'
import vertSrc_basic from './shaders/basic.vert.glsl'

import fragSrc_plane from './shaders/plane.frag.glsl'
import vertSrc_plane from './shaders/plane.vert.glsl'

import fragSrc_min from './shaders/min.frag.glsl'
import vertSrc_min from './shaders/min.vert.glsl'

import fragSrc_minplane from './shaders/minplane.frag.glsl'
import vertSrc_minplane from './shaders/minplane.vert.glsl'

import { initShowMedal, showMedal, setMode } from './showMedal'
import { previewOnclick, closeDialog } from './interact'


let dialog;
let canvas; //assume dialog>canvas
let styleTag;
let nameTag;
let descTag;
let dialogRect;
/** @type WebGLRenderingContext */
let gl;
let settings;
const textures = {};//access by name
const medals = {};//access by id
let createMedal;


export async function init(_settings) {
    settings = _settings;
    dialog = document.querySelector(settings.dialog_selector);
    canvas = document.querySelector(settings.canvas_selector);
    styleTag = document.querySelector(settings.style_selector);
    nameTag = document.querySelector(settings.name_selector);
    descTag = document.querySelector(settings.desc_selector);

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

    const shadarProgram_min = initShaderProgram(gl, vertSrc_min, fragSrc_min);
    const programInfo_min = getLocation(gl,
        shadarProgram_min,
        "aVertexPosition aVertexNormal",
        "uModelViewMatrix uProjectionMatrix uNormalMatrix",
        "uBaseColor"
    );

    const shadarProgram_minplane = initShaderProgram(gl, vertSrc_minplane, fragSrc_minplane);
    const programInfo_minplane = getLocation(gl,
        shadarProgram_minplane,
        "aVertexPosition aVertexNormal",
        "uSampler uModelViewMatrix uProjectionMatrix uNormalMatrix",
        "uInverseRadius"
    );

    // 公用几何图形
    const geo_MedalOuter = createMedalOuter();//外环+背面
    const geo_MedalInner = createMedalInner();//贴图处
    const geo_MedalOuter_min = createCirclePlane(64, 1, 0);
    const geo_MedalInner_min = createCirclePlane(64, 0.94, 0.0001);
    setGLBuffers(gl, geo_MedalOuter);
    setGLBuffers(gl, geo_MedalInner);
    setGLBuffers(gl, geo_MedalOuter_min);
    setGLBuffers(gl, geo_MedalInner_min);
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
    function createMedal_min(texture, baseColor) {
        const modelViewMatrix = mat4.create()
        return {
            view: modelViewMatrix,
            parts: [
                {
                    programInfo: programInfo_min,
                    geomertry: geo_MedalOuter_min,
                    uBaseColor: { func: "uniform3fv", v: baseColor }
                },
                {
                    programInfo: programInfo_minplane,
                    geomertry: geo_MedalInner_min,
                    texture: texture,
                    uInverseRadius: { func: "uniform1f", v: 1 / geo_MedalInner_min.vertex[0] }
                }
            ]
        }
    }


    createMedal = async function (param) {
        let texture;
        if (param.texture) {
            texture = await getTexture(param.texture);// get by name
        }
        let obj;
        switch (param.type) {
            case "basic":
                obj = createMedal_basic(texture, param.baseColor);
                break;
            case "min":
                obj = createMedal_min(texture, param.baseColor);
                break;
        }
        obj.name = param.name;
        obj.desc = param.desc;
        return obj
    }
    initShowMedal(canvas, gl);
    dialog.className = "fine-medal_idle";
    dialog.querySelector("button").onclick = () => closeDialog(dialog);
}

export async function getPreviews(selector, id_list) {
    dialog.className = "fine-medal_init";
    await nextFrame();
    dialogRect = dialog.getBoundingClientRect()
    const div = document.querySelector(selector);
    div.innerHTML = "";


    const objs = await Promise.all(id_list.map(async id => {
        let obj = medals[id];
        if (!obj) {
            medals[id] = await createMedal(settings.medals[id]);
            obj = medals[id];
            obj.id = id;
        }
        return obj;
    }));
    for (const obj of objs) {
        //console.log(obj)
        let preview = obj.preview
        if (!preview) {
            showMedal(gl, obj, false, 0);
            await nextFrame();
            obj.preview = await canvasToBlobUrl(canvas);
            preview = obj.preview;
        }

        const container = document.createElement("div");
        container.setAttribute("data-id", obj.id);
        container.title = obj.name;
        let img = new Image()
        img.src = preview;
        container.appendChild(img);
        container.addEventListener("click",
            () => {
                previewOnclick(container,
                    dialog, settings.dialog_selector, dialogRect, styleTag, () => {
                        showMedal(gl, obj, true, 2);
                        nameTag.innerHTML = obj.name;
                        descTag.innerHTML = obj.desc;
                    });
            }
        );
        div.appendChild(container);
    }
    dialog.className = "fine-medal_idle";
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
    const img = await loadImage(settings.texturePath + name + settings.textureExt);
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

export function setShowMode(mode) {
    return setMode(mode);
}