

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    return { x, y, w, h };
}

const lostTime = 0.5 * 1000;// ms
const chargeMaxTime = 1 * 1000;
export function initInteractiveCanvas(canvas, onRelease) {
    let startStamp = 0;
    let pos = null;
    let touch = false;
    let started = false;
    function tryRelease() {
        const now = performance.now();
        if (started) {
            //console.log(pos, now - startStamp)
            onRelease(pos, now - startStamp)
            started = false;
        }
    }
    canvas.addEventListener('mousedown', function (e) {
        if (touch) { return; }
        startStamp = performance.now();
        started = true;

    })
    canvas.addEventListener('touchstart', function (e) {
        touch = true;
        pos = getCursorPosition(canvas, e.touches[0]);
        startStamp = performance.now();
        started = true;


    })
    canvas.addEventListener('mouseup', function (e) {
        if (touch) { return; }
        pos = getCursorPosition(canvas, e);
        tryRelease();

    })
    canvas.addEventListener('touchend', function (e) {
        tryRelease();
        touch = false;
    })
    canvas.addEventListener('mouseout', function (e) {
        started = false;
    })
    canvas.addEventListener('touchcancel', function (e) {
        started = false;
        touch = false;
    })
    canvas.addEventListener('focusout', function (e) {
        started = false;
        touch = false;
    })
    
}
