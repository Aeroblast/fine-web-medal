import { mat4 } from 'gl-matrix'
import { initInteractiveCanvas } from './interact'
import { drawScene } from './basicGL'


const obj_base_pos = [-0.0, 0.0, -3.0];
const projectionMatrix = mat4.create();
const zNear = 0.1;
const zFar = 100.0;

const PI2 = Math.PI * 2;
const freeZone = 5 * Math.PI / 180;
const freeZoneDamping = 0.9;
const freeZoneRandomRate = 0.0001;
const pullBack = 0.00002;
let rotationAngle = 0;
let rotationVelocity = 0;


function onRelease(pos, delta) {
    const { x, y, w, h } = pos;
    let r = x - w / 2;
    let f = r * Math.min(delta, 800) * 0.001 * 0.001;
    rotationVelocity += f;
    //console.log(rotationVelocity)
}

export function initShowMedal(canvas, gl) {
    initInteractiveCanvas(canvas, onRelease);
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);


}
function update_flick(deltaTime) {
    rotationAngle += deltaTime * rotationVelocity;
    if (rotationAngle > PI2) { rotationAngle -= PI2; }
    if (rotationAngle < 0) { rotationAngle += PI2; }
    if (rotationAngle < Math.PI) {
        if (rotationAngle < freeZone) {
            rotationVelocity *= freeZoneDamping;
            rotationVelocity += (Math.random() - 0.5) * freeZoneRandomRate;
        } else {
            rotationVelocity -= pullBack * (rotationAngle - freeZone) * deltaTime;
        }

    } else {
        if (PI2 - rotationAngle < freeZone) {
            rotationVelocity *= freeZoneDamping;
            rotationVelocity += (Math.random() - 0.5) * freeZoneRandomRate;
        } else {
            rotationVelocity += pullBack * (PI2 - rotationAngle - freeZone) * deltaTime;
        }

    }
}
let loop = false;
export function stopLoop() {
    loop = false;
}
export function showMedal(gl, obj, setLoop = true, mode = 0) {
    loop = setLoop;
    let then = 0;
    function update(now) {
        const deltaTime = now - then; //ms
        then = now;
        switch (mode) {
            case 0: { } break;
            case 1: {
                rotationAngle += deltaTime * 0.0009; //调试用： 匀速转动
            }
                break;
            case 2:
                update_flick(deltaTime);
                break;
        }

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, obj_base_pos);

        mat4.rotateY(modelViewMatrix, modelViewMatrix, rotationAngle);

        obj.view = modelViewMatrix;

        drawScene(gl, projectionMatrix, [obj], deltaTime);

        if (loop) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}