window.QR_CODE_DEFAULT_ECC         = qrcodegen.QrCode.Ecc.MEDIUM;
window.QR_CODE_DEFAULT_BORDER_SIZE = 4;

export function getQrCodeSVG (content) {
    const qrcode = qrcodegen.QrCode.encodeText(content, window.QR_CODE_DEFAULT_ECC);
    return qrcode.toSvgString(window.QR_CODE_DEFAULT_BORDER_SIZE);
}
