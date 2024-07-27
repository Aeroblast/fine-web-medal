import { stopLoop } from './showMedal'

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    return { x, y, w, h };
}


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

let lastElement = null;

export function previewOnclick(el, dialog, dialogSelector, dialogRect, styleTag, callback) {
    if (lastElement) { return }
    lastElement = el;
    el.className = "fine-medal_hide";
    const rect = el.getBoundingClientRect();
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const triggerCenterX = rect.left + rect.width / 2;
    const triggerCenterY = rect.top + rect.height / 2;


    dialog.className = 'fine-medal_show_trans';

    const css = `
    ${dialogSelector}.fine-medal_show_trans {
        opacity: 0;
        transform: translate(-50%, 0) scale(0.1);
        top: ${triggerCenterY - dialogRect.height / 2}px;
        left: ${triggerCenterX}px;
     }
  
    ${dialogSelector}.fine-medal_show {
        opacity: 1;
        transform: translate(-50%, 0) scale(1);
        left: ${screenW / 2}px;
    }`

    styleTag.innerHTML = css;

    requestAnimationFrame(() => {
        dialog.className = 'fine-medal_show';
        callback();
    });

}

export function closeDialog(dialog) {
    dialog.className = 'fine-medal_show_trans';
    lastElement.className = "";
    lastElement = null;
    stopLoop();
    setTimeout(() => {
        dialog.className = 'fine-medal_idle';
    }, 500); // Match the transition duration
}