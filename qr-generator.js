const QR_CODE_DEFAULT_ECC         = qrcodegen.QrCode.Ecc.MEDIUM;
const QR_CODE_DEFAULT_BORDER_SIZE = 4;

export function getQrCodeSVG (content) {
    let qrcode = qrcodegen.QrCode.encodeText(content, QR_CODE_DEFAULT_ECC);
    return qrcode.toSvgString(QR_CODE_DEFAULT_BORDER_SIZE);
}
