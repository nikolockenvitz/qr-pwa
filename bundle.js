(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
var _qrScanner = require("./qr-scanner");
var _qrGenerator = require("./qr-generator");
var utils = _interopRequireWildcard(require("./utils"));
function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var tabs = {
  "create": {
    btnId: "btn-create-qr",
    boxId: "box-create-qr"
  },
  "scan": {
    btnId: "btn-scan-qr",
    boxId: "box-qr-scan-result"
  },
  "settings": {
    btnId: "btn-settings",
    boxId: "box-settings"
  }
};
var activeTabId = null;
var currentSvgContent = "";
window.onload = function () {
  loadAndApplyColorModeFromLocalStorage();
  var inputCreateQr = document.getElementById("input-create-qr");
  var txtScanResult = document.getElementById("txt-qr-scan-result");
  var qrWrapper = document.getElementById("div-qr-wrapper");
  var btnDownloadSvg = document.getElementById("btn-download-svg");
  inputCreateQr.value = "";
  qrWrapper.innerHTML = "";
  document.getElementById(tabs["create"].btnId).addEventListener("click", function () {
    showTab("create");
  });
  document.getElementById(tabs["scan"].btnId).addEventListener("click", function () {
    txtScanResult.textContent = "";
    showTab("scan");
    document.getElementById(tabs["scan"].boxId).style.display = "none"; // hide box until qr is scanned
    (0, _qrScanner.startQrScanner)(function (result) {
      showTab("scan");
      txtScanResult.textContent = result;
    });
  });
  document.getElementById(tabs["settings"].btnId).addEventListener("click", function () {
    showTab("settings");
  });
  inputCreateQr.addEventListener("input", function () {
    var text = inputCreateQr.value;
    showQrCode(text, qrWrapper, btnDownloadSvg);
  });
  btnDownloadSvg.addEventListener("click", function () {
    return downloadSvg(qrWrapper);
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
  var checkboxApplyColorModeToQrCode = document.getElementById("checkbox-apply-color-mode-to-qr-code");
  checkboxApplyColorModeToQrCode.addEventListener("change", function () {
    setColorModeApplicabilityForQrCode(checkboxApplyColorModeToQrCode.checked);
  });
  document.getElementById("btn-share").addEventListener("click", function () {
    showTab("create");
    var text = window.location.href;
    if (text.endsWith("/index.html")) {
      text = text.substring(0, text.length - "/index.html".length);
    }
    inputCreateQr.value = text;
    showQrCode(text, qrWrapper, btnDownloadSvg);
  });
  inputCreateQr.value = "";
  qrWrapper.innerHTML = "";
  showTab("create");
};
function showQrCode(text, qrWrapper, downloadButton) {
  if (text) {
    var svg = (0, _qrGenerator.getQrCodeSVG)(text);
    currentSvgContent = svg;
  } else {
    currentSvgContent = "";
  }
  qrWrapper.innerHTML = currentSvgContent;
  downloadButton.classList[currentSvgContent ? "remove" : "add"]("hidden");
}
function downloadSvg(baseElement) {
  var data = new XMLSerializer().serializeToString(baseElement.querySelector("svg"));
  var svgBlob = new Blob([data], {
    type: 'image/svg+xml;charset=utf-8'
  });
  var dataUrl = URL.createObjectURL(svgBlob);
  var a = document.createElement('a');
  a.setAttribute('download', 'qrcode.svg');
  a.setAttribute('href', dataUrl);
  a.setAttribute('target', '_blank');
  a.click();
}
function showTab(tabId) {
  hideActiveTab();
  var tab = tabs[tabId];
  document.getElementById(tab.btnId).classList.add("active");
  document.getElementById(tab.boxId).style.display = "block";
  activeTabId = tabId;
}
function hideActiveTab() {
  var tab = tabs[activeTabId];
  if (!tab) return;
  document.getElementById(tab.btnId).classList.remove("active");
  document.getElementById(tab.boxId).style.display = "none";
  document.getElementById("btn-stop-qr-scanner").style.display = "none";
}
var LS_COLOR_MODE = "qr-pwa-color-mode";
var LS_APPLY_COLOR_MODE_TO_QR_CODE = "qr-pwa-color-mode-for-qr-code";
function loadAndApplyColorModeFromLocalStorage() {
  var colorMode = localStorage.getItem(LS_COLOR_MODE) || "dark-mode";
  var applyColorModeToQrCode = localStorage.getItem(LS_APPLY_COLOR_MODE_TO_QR_CODE) === "true";
  setColorMode(colorMode, false);
  setColorModeApplicabilityForQrCode(applyColorModeToQrCode, false);
}
function setColorMode(colorMode) {
  var saveToLocalStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  document.body.setAttribute("data-color-mode", colorMode);
  if (saveToLocalStorage) {
    localStorage.setItem(LS_COLOR_MODE, colorMode);
  }
}
function setColorModeApplicabilityForQrCode(applyColorModeToQrCode) {
  var saveToLocalStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var qrWrapper = document.getElementById("div-qr-wrapper");
  if (applyColorModeToQrCode) {
    qrWrapper.classList.add("apply-color-mode");
  } else {
    qrWrapper.classList.remove("apply-color-mode");
  }
  document.getElementById("checkbox-apply-color-mode-to-qr-code").checked = applyColorModeToQrCode;
  if (saveToLocalStorage) {
    localStorage.setItem(LS_APPLY_COLOR_MODE_TO_QR_CODE, applyColorModeToQrCode);
  }
}

},{"./qr-generator":3,"./qr-scanner":4,"./utils":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
// MIT License - Copyright (c) 2017 Nimiq, danimoh - https://github.com/nimiq/qr-scanner
var e = /*#__PURE__*/function () {
  _createClass(e, null, [{
    key: "hasCamera",
    value: function hasCamera() {
      return navigator.mediaDevices.enumerateDevices().then(function (a) {
        return a.some(function (a) {
          return "videoinput" === a.kind;
        });
      })["catch"](function () {
        return !1;
      });
    }
  }]);
  function e(a, c) {
    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : e.DEFAULT_CANVAS_SIZE;
    _classCallCheck(this, e);
    this.$video = a;
    this.$canvas = document.createElement("canvas");
    this._onDecode = c;
    this._paused = this._active = !1;
    this.$canvas.width = b;
    this.$canvas.height = b;
    this._sourceRect = {
      x: 0,
      y: 0,
      width: b,
      height: b
    };
    this._onCanPlay = this._onCanPlay.bind(this);
    this._onPlay = this._onPlay.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this.$video.addEventListener("canplay", this._onCanPlay);
    this.$video.addEventListener("play", this._onPlay);
    document.addEventListener("visibilitychange", this._onVisibilityChange);
    this._qrWorker = new Worker(e.WORKER_PATH);
  }
  _createClass(e, [{
    key: "destroy",
    value: function destroy() {
      this.$video.removeEventListener("canplay", this._onCanPlay);
      this.$video.removeEventListener("play", this._onPlay);
      document.removeEventListener("visibilitychange", this._onVisibilityChange);
      this.stop();
      this._qrWorker.postMessage({
        type: "close"
      });
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;
      if (this._active && !this._paused) return Promise.resolve();
      "https:" !== window.location.protocol && console.warn("The camera stream is only accessible if the page is transferred via https.");
      this._active = !0;
      this._paused = !1;
      if (document.hidden) return Promise.resolve();
      clearTimeout(this._offTimeout);
      this._offTimeout = null;
      if (this.$video.srcObject) return this.$video.play(), Promise.resolve();
      var a = "environment";
      return this._getCameraStream("environment", !0)["catch"](function () {
        a = "user";
        return _this._getCameraStream();
      }).then(function (c) {
        _this.$video.srcObject = c;
        _this._setVideoMirror(a);
      })["catch"](function (a) {
        _this._active = !1;
        throw a;
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      this.pause();
      this._active = !1;
    }
  }, {
    key: "pause",
    value: function pause() {
      var _this2 = this;
      this._paused = !0;
      this._active && (this.$video.pause(), this._offTimeout || (this._offTimeout = setTimeout(function () {
        var a = _this2.$video.srcObject && _this2.$video.srcObject.getTracks()[0];
        a && (a.stop(), _this2._offTimeout = _this2.$video.srcObject = null);
      }, 300)));
    }
  }, {
    key: "setGrayscaleWeights",
    value: function setGrayscaleWeights(a, c, b) {
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : !0;
      this._qrWorker.postMessage({
        type: "grayscaleWeights",
        data: {
          red: a,
          green: c,
          blue: b,
          useIntegerApproximation: d
        }
      });
    }
  }, {
    key: "setInversionMode",
    value: function setInversionMode(a) {
      this._qrWorker.postMessage({
        type: "inversionMode",
        data: a
      });
    }
  }, {
    key: "_onCanPlay",
    value: function _onCanPlay() {
      this._updateSourceRect();
      this.$video.play();
    }
  }, {
    key: "_onPlay",
    value: function _onPlay() {
      this._updateSourceRect();
      this._scanFrame();
    }
  }, {
    key: "_onVisibilityChange",
    value: function _onVisibilityChange() {
      document.hidden ? this.pause() : this._active && this.start();
    }
  }, {
    key: "_updateSourceRect",
    value: function _updateSourceRect() {
      var a = Math.round(2 / 3 * Math.min(this.$video.videoWidth, this.$video.videoHeight));
      this._sourceRect.width = this._sourceRect.height = a;
      this._sourceRect.x = (this.$video.videoWidth - a) / 2;
      this._sourceRect.y = (this.$video.videoHeight - a) / 2;
    }
  }, {
    key: "_scanFrame",
    value: function _scanFrame() {
      var _this3 = this;
      if (!this._active || this.$video.paused || this.$video.ended) return !1;
      requestAnimationFrame(function () {
        e.scanImage(_this3.$video, _this3._sourceRect, _this3._qrWorker, _this3.$canvas, !0).then(_this3._onDecode, function (a) {
          _this3._active && "QR code not found." !== a && console.error(a);
        }).then(function () {
          return _this3._scanFrame();
        });
      });
    }
  }, {
    key: "_getCameraStream",
    value: function _getCameraStream(a) {
      var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;
      var b = [{
        width: {
          min: 1024
        }
      }, {
        width: {
          min: 768
        }
      }, {}];
      a && (c && (a = {
        exact: a
      }), b.forEach(function (b) {
        return b.facingMode = a;
      }));
      return this._getMatchingCameraStream(b);
    }
  }, {
    key: "_getMatchingCameraStream",
    value: function _getMatchingCameraStream(a) {
      var _this4 = this;
      return 0 === a.length ? Promise.reject("Camera not found.") : navigator.mediaDevices.getUserMedia({
        video: a.shift()
      })["catch"](function () {
        return _this4._getMatchingCameraStream(a);
      });
    }
  }, {
    key: "_setVideoMirror",
    value: function _setVideoMirror(a) {
      this.$video.style.transform = "scaleX(" + ("user" === a ? -1 : 1) + ")";
    }
  }], [{
    key: "scanImage",
    value: function scanImage(a) {
      var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var f = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : !1;
      var g = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : !1;
      var h = !1,
        l = new Promise(function (l, g) {
          b || (b = new Worker(e.WORKER_PATH), h = !0, b.postMessage({
            type: "inversionMode",
            data: "both"
          }));
          var n, _m, _k;
          _m = function m(a) {
            "qrResult" === a.data.type && (b.removeEventListener("message", _m), b.removeEventListener("error", _k), clearTimeout(n), null !== a.data.data ? l(a.data.data) : g("QR code not found."));
          };
          _k = function k(a) {
            b.removeEventListener("message", _m);
            b.removeEventListener("error", _k);
            clearTimeout(n);
            g("Scanner error: " + (a ? a.message || a : "Unknown Error"));
          };
          b.addEventListener("message", _m);
          b.addEventListener("error", _k);
          n = setTimeout(function () {
            return _k("timeout");
          }, 3E3);
          e._loadImage(a).then(function (a) {
            a = e._getImageData(a, c, d, f);
            b.postMessage({
              type: "decode",
              data: a
            }, [a.data.buffer]);
          })["catch"](_k);
        });
      c && g && (l = l["catch"](function () {
        return e.scanImage(a, null, b, d, f);
      }));
      return l = l["finally"](function () {
        h && b.postMessage({
          type: "close"
        });
      });
    }
  }, {
    key: "_getImageData",
    value: function _getImageData(a) {
      var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : !1;
      b = b || document.createElement("canvas");
      var f = c && c.x ? c.x : 0,
        g = c && c.y ? c.y : 0,
        h = c && c.width ? c.width : a.width || a.videoWidth;
      c = c && c.height ? c.height : a.height || a.videoHeight;
      d || b.width === h && b.height === c || (b.width = h, b.height = c);
      d = b.getContext("2d", {
        alpha: !1
      });
      d.imageSmoothingEnabled = !1;
      d.drawImage(a, f, g, h, c, 0, 0, b.width, b.height);
      return d.getImageData(0, 0, b.width, b.height);
    }
  }, {
    key: "_loadImage",
    value: function _loadImage(a) {
      if (a instanceof HTMLCanvasElement || a instanceof HTMLVideoElement || window.ImageBitmap && a instanceof window.ImageBitmap || window.OffscreenCanvas && a instanceof window.OffscreenCanvas) return Promise.resolve(a);
      if (a instanceof Image) return e._awaitImageLoad(a).then(function () {
        return a;
      });
      if (a instanceof File || a instanceof URL || "string" === typeof a) {
        var c = new Image();
        c.src = a instanceof File ? URL.createObjectURL(a) : a;
        return e._awaitImageLoad(c).then(function () {
          a instanceof File && URL.revokeObjectURL(c.src);
          return c;
        });
      }
      return Promise.reject("Unsupported image type.");
    }
  }, {
    key: "_awaitImageLoad",
    value: function _awaitImageLoad(a) {
      return new Promise(function (c, b) {
        if (a.complete && 0 !== a.naturalWidth) c();else {
          var _d, _f;
          _d = function d() {
            a.removeEventListener("load", _d);
            a.removeEventListener("error", _f);
            c();
          };
          _f = function f() {
            a.removeEventListener("load", _d);
            a.removeEventListener("error", _f);
            b("Image load error");
          };
          a.addEventListener("load", _d);
          a.addEventListener("error", _f);
        }
      });
    }
  }]);
  return e;
}();
e.DEFAULT_CANVAS_SIZE = 400;
e.WORKER_PATH = "qr-scanner-worker.min.js";
var _default = e;
exports["default"] = _default;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQrCodeSVG = getQrCodeSVG;
window.QR_CODE_DEFAULT_ECC = qrcodegen.QrCode.Ecc.MEDIUM;
window.QR_CODE_DEFAULT_BORDER_SIZE = 4;
function getQrCodeSVG(content) {
  var qrcode = qrcodegen.QrCode.encodeText(content, window.QR_CODE_DEFAULT_ECC);
  return qrcode.toSvgString(window.QR_CODE_DEFAULT_BORDER_SIZE);
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startQrScanner = startQrScanner;
var _qrScannerMin = _interopRequireDefault(require("./lib/qr-scanner.min.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_qrScannerMin["default"].WORKER_PATH = './lib/qr-scanner-worker.min.js';
_qrScannerMin["default"].DEFAULT_CANVAS_SIZE = 1000;
var video = document.getElementById("camera-view");
var btnStopQrScanner = document.getElementById("btn-stop-qr-scanner");
var qrScannerFrame = document.getElementById("qr-scanner-frame");
var qrScannerFrameBlurN = document.getElementById("qr-scanner-frame-blur-n");
var qrScannerFrameBlurE = document.getElementById("qr-scanner-frame-blur-e");
var qrScannerFrameBlurS = document.getElementById("qr-scanner-frame-blur-s");
var qrScannerFrameBlurW = document.getElementById("qr-scanner-frame-blur-w");
var qrScanner = null;
function startQrScanner(callback) {
  // TODO: what if qrScanner already running?
  qrScanner = new _qrScannerMin["default"](video, function (result) {
    stopQrScanner();
    callback(result);
  });
  qrScanner.setInversionMode("both");
  qrScanner.start();
  showQrScannerVideo();
  showStopQrScannerButton();
  showQrScannerFrame();
}
function stopQrScanner() {
  if (qrScanner) {
    qrScanner.destroy();
  }
  qrScanner = null;
  hideQrScannerVideo();
  hideStopQrScannerButton();
  hideQrScannerFrame();
}
function showQrScannerVideo() {
  video.style.visibility = "visible";
}
function hideQrScannerVideo() {
  video.style.visibility = "hidden";
}
function showStopQrScannerButton() {
  btnStopQrScanner.style.display = "inline";
  btnStopQrScanner.addEventListener("click", stopQrScanner);
}
function hideStopQrScannerButton() {
  btnStopQrScanner.style.display = "none";
}
function showQrScannerFrame() {
  function t() {
    if (video.clientWidth === 300 && video.clientHeight === 150) {
      setTimeout(t, 500);
    } else {
      var RATIO_HIGHLIGHTED = 0.7;
      var BORDER_SIZE = 5;
      var _video$getBoundingCli = video.getBoundingClientRect(),
        x = _video$getBoundingCli.x,
        y = _video$getBoundingCli.y,
        width = _video$getBoundingCli.width,
        height = _video$getBoundingCli.height;
      var frameSize = Math.min(width, height) * RATIO_HIGHLIGHTED;
      var frameX = x + (width - frameSize) / 2;
      var frameY = y + (height - frameSize) / 2;
      qrScannerFrame.style.width = frameSize - 2 * BORDER_SIZE + "px";
      qrScannerFrame.style.height = frameSize - 2 * BORDER_SIZE + "px";
      qrScannerFrame.style.left = frameX + "px";
      qrScannerFrame.style.top = frameY + "px";
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
function hideQrScannerFrame() {
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

},{"./lib/qr-scanner.min.js":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyTextToClipboard = copyTextToClipboard;
exports.showToast = showToast;
function copyTextToClipboard(text) {
  var input = document.getElementById("input-copy-to-clipboard");
  input.value = text;
  input.select();
  input.setSelectionRange(0, text.length);
  document.execCommand("copy");
  input.blur();
  showToast("Copied to Clipboard!");
}
function showToast(text) {
  var durationInSeconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var boxToasts = document.getElementById("div-toasts");
  var toast = boxToasts.getElementsByTagName("template")[0].content.children[0].cloneNode(true);
  toast.innerText = text; // TODO!
  boxToasts.appendChild(toast);
  toast.style.opacity = 1;
  setTimeout(function () {
    toast.style.opacity = 0; // fade out
    setTimeout(function () {
      boxToasts.removeChild(toast);
    }, 3000);
  }, durationInSeconds * 1000);
}

},{}]},{},[1]);
