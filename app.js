import { startQrScanner } from './qr-scanner';
import { getQrCodeSVG } from './qr-generator';
import * as utils from './utils';

window.onload = function () {
    console.log("app is running");
    let boxCreateQr = document.getElementById("box-create-qr");
    let boxScanResult = document.getElementById("box-qr-scan-result");

    let inputCreateQr = document.getElementById("input-create-qr");
    let txtScanResult = document.getElementById("txt-qr-scan-result");

    let qrWrapper = document.getElementById("div-qr-wrapper");

    document.getElementById("btn-create-qr").addEventListener("click", function () {
        boxScanResult.style.display = "none";
        boxCreateQr.style.display = "block";
        inputCreateQr.value = "";
        qrWrapper.innerHTML = "";
    });
    document.getElementById("btn-scan-qr").addEventListener("click", function () {
        boxCreateQr.style.display = "none";
        startQrScanner(function (result) {
            boxCreateQr.style.display = "none";
            boxScanResult.style.display = "block";
            txtScanResult.textContent = result;
        });
    });

    inputCreateQr.addEventListener("input", function () {
        let text = inputCreateQr.value;
        if (text) {
            let svg = getQrCodeSVG(text);
            qrWrapper.innerHTML = svg;
        } else {
            qrWrapper.innerHTML = "";
        }
    });
    document.getElementById("btn-qr-scan-result-copy").addEventListener("click", function () {
        utils.copyTextToClipboard(txtScanResult.textContent);
    });
};
