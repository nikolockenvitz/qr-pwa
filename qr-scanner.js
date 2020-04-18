"use strict";

import QrScanner from './lib/qr-scanner.min.js';
QrScanner.WORKER_PATH = './lib/qr-scanner-worker.min.js';
QrScanner.DEFAULT_CANVAS_SIZE = 1000;

const video = document.getElementById("camera-view");
const btnStopQrScanner = document.getElementById("btn-stop-qr-scanner");
const qrScannerFrame = document.getElementById("qr-scanner-frame");
const qrScannerFrameBlurN = document.getElementById("qr-scanner-frame-blur-n");
const qrScannerFrameBlurE = document.getElementById("qr-scanner-frame-blur-e");
const qrScannerFrameBlurS = document.getElementById("qr-scanner-frame-blur-s");
const qrScannerFrameBlurW = document.getElementById("qr-scanner-frame-blur-w");

let qrScanner = null;

export function startQrScanner (callback) {
    // TODO: what if qrScanner already running?
    qrScanner = new QrScanner(video, result => {
        stopQrScanner();
        callback(result);
    });
    qrScanner.setInversionMode("both");
    qrScanner.start();
    showQrScannerVideo();
    showStopQrScannerButton();
    showQrScannerFrame();
}
function stopQrScanner () {
    if (qrScanner) {
        qrScanner.destroy();
    }
    qrScanner = null;
    hideQrScannerVideo();
    hideStopQrScannerButton();
    hideQrScannerFrame();
}
function showQrScannerVideo () {
    video.style.visibility = "visible";
}
function hideQrScannerVideo () {
    video.style.visibility = "hidden";
}
function showStopQrScannerButton () {
    btnStopQrScanner.style.display = "inline";
    btnStopQrScanner.addEventListener("click", stopQrScanner);
}
function hideStopQrScannerButton () {
    btnStopQrScanner.style.display = "none";
}
function showQrScannerFrame () {
    function t () {
        if (video.clientWidth === 300 && video.clientHeight === 150) {
            setTimeout(t, 500);
        } else {
            const RATIO_HIGHLIGHTED = 0.7;
            const BORDER_SIZE = 5;
            let {x, y, width, height } = video.getBoundingClientRect();
            let frameSize = Math.min(width, height) * RATIO_HIGHLIGHTED;
            let frameX = x + (width  - frameSize) / 2;
            let frameY = y + (height - frameSize) / 2;
            qrScannerFrame.style.width  = (frameSize - 2*BORDER_SIZE) + "px";
            qrScannerFrame.style.height = (frameSize - 2*BORDER_SIZE) + "px";
            qrScannerFrame.style.left = frameX + "px";
            qrScannerFrame.style.top  = frameY + "px";
            qrScannerFrame.style.display = "block";

            qrScannerFrameBlurN.style.width = frameX + frameSize + "px";
            qrScannerFrameBlurN.style.height = frameY + "px";
            qrScannerFrameBlurN.style.left = 0 + "px";
            qrScannerFrameBlurN.style.top = 0 + "px";
            qrScannerFrameBlurN.style.display = "block";

            qrScannerFrameBlurE.style.width = frameX + "px";
            qrScannerFrameBlurE.style.height = frameY + frameSize + "px";
            qrScannerFrameBlurE.style.left = frameX + frameSize + "px";
            qrScannerFrameBlurE.style.top = 0 + "px";
            qrScannerFrameBlurE.style.display = "block";

            qrScannerFrameBlurS.style.width = frameX + frameSize + "px";
            qrScannerFrameBlurS.style.height = frameY + "px";
            qrScannerFrameBlurS.style.left = frameX + "px";
            qrScannerFrameBlurS.style.top = frameY + frameSize + "px";
            qrScannerFrameBlurS.style.display = "block";

            qrScannerFrameBlurW.style.width = frameX + "px";
            qrScannerFrameBlurW.style.height = frameY + frameSize + "px";
            qrScannerFrameBlurW.style.left = 0 + "px";
            qrScannerFrameBlurW.style.top = frameY + "px";
            qrScannerFrameBlurW.style.display = "block";
        }
    }
    t();
}
function hideQrScannerFrame () {
    qrScannerFrame.style.display = "none";
    qrScannerFrameBlurN.style.display = "none";
    qrScannerFrameBlurE.style.display = "none";
    qrScannerFrameBlurS.style.display = "none";
    qrScannerFrameBlurW.style.display = "none";
}

window.addEventListener("resize", function () {
    if (qrScannerFrame.offsetWidth > 0 && qrScannerFrame.offsetHeight > 0) {
        showQrScannerFrame();
    }
});