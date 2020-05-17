import { startQrScanner } from './qr-scanner';
import { getQrCodeSVG } from './qr-generator';
import * as utils from './utils';

const tabs = {
    "create": { btnId: "btn-create-qr", boxId: "box-create-qr" },
    "scan": { btnId: "btn-scan-qr", boxId: "box-qr-scan-result" },
    "settings": { btnId: "btn-settings", boxId: "box-settings" },
};
let activeTabId = null;

window.onload = function () {
    loadAndApplyColorModeFromLocalStorage();
    let inputCreateQr = document.getElementById("input-create-qr");
    let txtScanResult = document.getElementById("txt-qr-scan-result");

    let qrWrapper = document.getElementById("div-qr-wrapper");

    inputCreateQr.value = "";
    qrWrapper.innerHTML = "";

    document.getElementById(tabs["create"].btnId).addEventListener("click", function () {
        showTab("create");
    });
    document.getElementById(tabs["scan"].btnId).addEventListener("click", function () {
        txtScanResult.textContent = "";
        showTab("scan");
        document.getElementById(tabs["scan"].boxId).style.display = "none"; // hide box until qr is scanned
        startQrScanner(function (result) {
            showTab("scan");
            txtScanResult.textContent = result;
        });
    });
    document.getElementById(tabs["settings"].btnId).addEventListener("click", function () {
        showTab("settings");
    });

    inputCreateQr.addEventListener("input", function () {
        let text = inputCreateQr.value;
        showQrCode(text, qrWrapper);
    });
    document.getElementById("btn-qr-scan-result-copy").addEventListener("click", function () {
        utils.copyTextToClipboard(txtScanResult.textContent);
    });

    document.getElementById("btn-light-mode").addEventListener("click", function () {
        setColorMode("light-mode");
    });
    document.getElementById("btn-dark-mode").addEventListener("click", function () {
        setColorMode("dark-mode");
    });
    const checkboxApplyColorModeToQrCode = document.getElementById("checkbox-apply-color-mode-to-qr-code");
    checkboxApplyColorModeToQrCode.addEventListener("change", function () {
        setColorModeApplicabilityForQrCode(checkboxApplyColorModeToQrCode.checked);
    });
    document.getElementById("btn-share").addEventListener("click", function () {
        showTab("create");
        let text = window.location.href;
        if (text.endsWith("/index.html")) {
            text = text.substring(0, text.length - "/index.html".length)
        }
        inputCreateQr.value = text;
        showQrCode(text, qrWrapper);
    });

    inputCreateQr.value = "";
    qrWrapper.innerHTML = "";
    showTab("create");
};

function showQrCode (text, qrWrapper) {
    if (text) {
        let svg = getQrCodeSVG(text);
        qrWrapper.innerHTML = svg;
    } else {
        qrWrapper.innerHTML = "";
    }
}

function showTab (tabId) {
    hideActiveTab();
    let tab = tabs[tabId];
    document.getElementById(tab.btnId).classList.add("active");
    document.getElementById(tab.boxId).style.display = "block";
    activeTabId = tabId;
}

function hideActiveTab () {
    let tab = tabs[activeTabId];
    if (!tab) return;
    document.getElementById(tab.btnId).classList.remove("active");
    document.getElementById(tab.boxId).style.display = "none";

    document.getElementById("btn-stop-qr-scanner").style.display = "none";
}

const LS_COLOR_MODE = "qr-pwa-color-mode";
const LS_APPLY_COLOR_MODE_TO_QR_CODE = "qr-pwa-color-mode-for-qr-code";
function loadAndApplyColorModeFromLocalStorage () {
    let colorMode = localStorage.getItem(LS_COLOR_MODE) || "dark-mode";
    let applyColorModeToQrCode = (localStorage.getItem(LS_APPLY_COLOR_MODE_TO_QR_CODE) !== "false");
    setColorMode(colorMode, false);
    setColorModeApplicabilityForQrCode(applyColorModeToQrCode, false);
}
function setColorMode (colorMode, saveToLocalStorage=true) {
    document.body.setAttribute("data-color-mode", colorMode);
    if (saveToLocalStorage) {
        localStorage.setItem(LS_COLOR_MODE, colorMode);
    }
}
function setColorModeApplicabilityForQrCode (applyColorModeToQrCode, saveToLocalStorage=true) {
    const qrWrapper = document.getElementById("div-qr-wrapper");
    if (applyColorModeToQrCode) {
        qrWrapper.classList.add("apply-color-mode");
    } else {
        qrWrapper.classList.remove("apply-color-mode");
    }
    if (saveToLocalStorage) {
        localStorage.setItem(LS_APPLY_COLOR_MODE_TO_QR_CODE, applyColorModeToQrCode);
    }
}