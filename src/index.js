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

import fragSrc_reflect from './shaders/reflect.frag.glsl'
import vertSrc_reflect from './shaders/reflect.vert.glsl'
import fragSrc_reflect_normal from './shaders/reflect_normal.frag.glsl'

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
const cubeTextures = {};//access by name
const medals = {};//access by id
let createMedal;
let singleColorTextures = {}; // #hex string to gl texture

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

    const shadarProgram_reflect = initShaderProgram(gl, vertSrc_reflect, fragSrc_reflect);
    const programInfo_reflect = getLocation(gl,
        shadarProgram_reflect,
        "aVertexPosition aVertexNormal",
        "uSampler uCubeSampler uModelViewMatrix uProjectionMatrix uNormalMatrix",
        "uInverseRadius"
    );

    const shadarProgram_reflect_normal = initShaderProgram(gl, vertSrc_reflect, fragSrc_reflect_normal);
    const programInfo_reflect_normal = getLocation(gl,
        shadarProgram_reflect_normal,
        "aVertexPosition aVertexNormal",
        "uSampler uSampler2 uCubeSampler uModelViewMatrix uProjectionMatrix uNormalMatrix",
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



    /** 
     * @param {Object} param
     * @param param.baseColor Color
     * @param param.texture Filename/Color
     * */
    async function createMedal_min(param) {
        const modelViewMatrix = mat4.create();
        const texture = await getTextureFromType(param.texture);
        return {
            view: modelViewMatrix,
            parts: [
                {
                    programInfo: programInfo_min,
                    geomertry: geo_MedalOuter_min,
                    uBaseColor: { func: "uniform3fv", v: parseColor(param.baseColor) }
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
    /** 
     * @param {Object} param
     * @param param.baseColor color
     * @param param.texture filename or color
     * */
    async function createMedal_basic(param) {
        const modelViewMatrix = mat4.create();
        const texture = await getTextureFromType(param.texture);
        return {
            view: modelViewMatrix,
            parts: [
                {
                    programInfo: programInfo_basic,
                    geomertry: geo_MedalOuter,
                    uBaseColor: { func: "uniform3fv", v: parseColor(param.baseColor) }
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
    /** 
     * @param {Object} param
     * @param param.baseColor color
     * @param param.texture filename or color
     * @param param.cubeTexture filename 
     * */
    async function createMedal_basic_reflect(param) {
        const modelViewMatrix = mat4.create();
        const cubeTexture = await getCubeTexture(param.cubeTexture);// get by name
        const texture = await getTextureFromType(param.texture);
        return {
            view: modelViewMatrix,
            parts: [
                {
                    programInfo: programInfo_reflect,
                    geomertry: geo_MedalOuter,
                    texture: getSingleColorTexture(param.baseColor),
                    cubeTexture: cubeTexture,
                    uInverseRadius: { func: "uniform1f", v: 1 }
                },
                {
                    programInfo: programInfo_reflect,
                    geomertry: geo_MedalInner,
                    texture: texture,
                    cubeTexture: cubeTexture,
                    uInverseRadius: { func: "uniform1f", v: 1 / geo_MedalInner.vertex[0] }
                }
            ]
        }
    }
    /** 
 * @param {Object} param
 * @param param.baseColor color
 * @param param.texture filename or color
 * @param param.cubeTexture filename 
 * @param param.normalTexture filename 
 * */
    async function createMedal_basic_reflect_normal(param) {
        const modelViewMatrix = mat4.create();
        const cubeTexture = await getCubeTexture(param.cubeTexture);// get by name
        const texture = await getTextureFromType(param.texture);
        const normalTexture = await getTexture(param.normalTexture);

        return {
            view: modelViewMatrix,
            parts: [
                {
                    programInfo: programInfo_reflect,
                    geomertry: geo_MedalOuter,
                    texture: getSingleColorTexture(param.baseColor),
                    cubeTexture: cubeTexture,
                    uInverseRadius: { func: "uniform1f", v: 1 }
                },
                {
                    programInfo: programInfo_reflect_normal,
                    geomertry: geo_MedalInner,
                    texture: texture,
                    texture2: normalTexture,
                    cubeTexture: cubeTexture,
                    uInverseRadius: { func: "uniform1f", v: 1 / geo_MedalInner.vertex[0] }
                }
            ]
        }
    }

    createMedal = async function (param) {
        const func = {
            "basic": createMedal_basic,
            "min": createMedal_min,
            "basic_reflect": createMedal_basic_reflect,
            "basic_reflect_normal": createMedal_basic_reflect_normal
        }[param.type];
        const obj = await func(param);

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

const images = {};
async function loadImage(src) {
    let r = images[src];
    if (r) return r;

    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => {
            images[src] = img;
            resolve(img)
        }
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

    textures[name] = texture;
    return texture;
}


async function getCubeTexture(name) {
    const cubeTextureNames = [
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, n: '-px', },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, n: '-nx', },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, n: '-py', },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, n: '-ny', },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, n: '-pz', },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, n: '-nz', },
    ];
    const t = cubeTextures[name];
    if (t) {
        return t;
    }
    const imgs = await Promise.all(cubeTextureNames.map(async info => {
        const img = await loadImage(settings.texturePath + name + info.n + settings.textureExt);
        return {
            target: info.target,
            img: img
        }
    }));
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    for (const imgInfo of imgs) {
        const { target, img } = imgInfo;

        const level = 0;
        const internalFormat = gl.RGB;
        const srcFormat = gl.RGB;
        const srcType = gl.UNSIGNED_BYTE;
        gl.texImage2D(
            target,
            level,
            internalFormat,
            srcFormat,
            srcType,
            img,
        );
    }
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    cubeTextures[name] = texture;
    return texture;
}

function getTextureFromType(x) {
    if (/#[0-9a-fA-F]{6}/.test(x)) {
        // color
        return getSingleColorTexture(x);
    }

    if (typeof x === 'string') {
        return getTexture(x);
    }
}

function getSingleColorTexture(colorName) {
    let texture = singleColorTextures[colorName];
    if (texture) return texture;
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const color = parseColor(colorName);

    const level = 0;
    const internalFormat = gl.RGB;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGB;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array(color.map(v => v * 255)); // opaque blue
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    );
    singleColorTextures[colorName] = texture;
    return texture;
}

function parseColor(hex) {
    hex = hex.replace('#', '');
    let bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
    return [r / 255, g / 255, b / 255];
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