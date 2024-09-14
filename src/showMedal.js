import { mat4 } from 'gl-matrix'
import { initInteractiveCanvas } from './interact'
import { drawScene } from './basicGL'


const obj_base_pos = [-0.0, 0.0, -2.7];
const projectionMatrix = mat4.create();
const zNear = 0.1;
const zFar = 100.0;

const PI2 = Math.PI * 2;

let rotationAngle = 0;
let rotationVelocity = 0;

export function initShowMedal(canvas, gl) {
    initInteractiveCanvas(canvas, onRelease);
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
}

//0:null 
//1:check 
//2:flick
let mode = 0;
const modeUpdate = [null, check_update, flick_update];
const modeOnRelease = [null, check_onRelease, flick_onRelease];

let loop = false;
export function stopLoop() {
    loop = false;
}
export function showMedal(gl, obj, setLoop = true, _mode = 0) {
    loop = setLoop;
    mode = _mode;
    let then = 0;
    rotationAngle = 0;
    rotationVelocity = 0;
    function update(now) {
        let deltaTime = now - then; //ms
        if (deltaTime > 1000 / 10) { deltaTime = 1000 / 30; }
        then = now;

        const f = modeUpdate[mode];
        if (f) f(deltaTime);

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, obj_base_pos);

        mat4.rotateY(modelViewMatrix, modelViewMatrix, rotationAngle);

        obj.view = modelViewMatrix;

        drawScene(gl, projectionMatrix, [obj], deltaTime);

        if (loop) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
function onRelease(pos, delta) {
    const f = modeOnRelease[mode];
    const { x, y, w, h } = pos;
    if (x < 0.1 * w && y < h * 0.1) {
        if (delta > 500) {
            mode = (mode % 2) + 1;
        }
    }
    let r = x - w / 2;
    let ry = y - h / 2;
    if (r * r + ry * ry > w * w / 4 * 0.9) { return; }//在圆外面
    if (f) { f(pos, delta) }
}
export function setMode(_mode) {
    if ([0, 1, 2].includes(_mode)) {
        mode = _mode;
        return mode;
    } else {
        console.warn("Invaild mode: " + _mode);
    }
    return false;
}

// mode: check
let check_pause = false;
function check_update(deltaTime) {
    if (!check_pause) {
        rotationAngle += deltaTime * 0.0009; //调试用： 匀速转动
    }
}
function check_onRelease(pos, delta) {
    check_pause = !check_pause;
}

const flick_freeZone = 5 * Math.PI / 180;
const flick_freeZoneDamping = 0.9;
const flick_speedOverDamping = 0.8;
const flick_freeZoneRandomRate = 0.0001;
const flick_pullBack = 0.000015;
function flick_update(deltaTime) {
    rotationAngle += deltaTime * rotationVelocity;
    if (rotationAngle > PI2) { rotationAngle -= PI2; }
    if (rotationAngle < 0) { rotationAngle += PI2; }
    if (rotationAngle < Math.PI) {
        if (rotationAngle < flick_freeZone) {
            rotationVelocity *= flick_freeZoneDamping;
            rotationVelocity += (Math.random() - 0.5) * flick_freeZoneRandomRate;
        } else {
            if (Math.abs(rotationVelocity) > 10) rotationVelocity *= flick_speedOverDamping;
            rotationVelocity -= flick_pullBack * (rotationAngle - flick_freeZone) * deltaTime;
        }

    } else {
        if (PI2 - rotationAngle < flick_freeZone) {
            rotationVelocity *= flick_freeZoneDamping;
            rotationVelocity += (Math.random() - 0.5) * flick_freeZoneRandomRate;
        } else {
            rotationVelocity += flick_pullBack * (PI2 - rotationAngle - flick_freeZone) * deltaTime;
        }

    }
}

function flick_onRelease(pos, delta) {
    const { x, y, w, h } = pos;
    let r = x - w / 2;
    if (delta < 300) {
        delta = 40;
    }
    let fr = r * Math.min(delta, 800) * 0.001 * 0.001;
    rotationVelocity += fr;
}
