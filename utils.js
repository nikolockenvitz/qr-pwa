export function copyTextToClipboard (text) {
    let input = document.getElementById("input-copy-to-clipboard");
    input.value = text;
    input.select();
    input.setSelectionRange(0, text.length);
    document.execCommand("copy");
    input.blur();
    showToast("Copied to Clipboard!");
}

export function showToast (text, durationInSeconds=2) {
    let boxToasts = document.getElementById("div-toasts");
    let toast = boxToasts.getElementsByTagName("template")[0].content.children[0].cloneNode(true);
    toast.innerText = text; // TODO!
    boxToasts.appendChild(toast);
    toast.style.opacity = 1;
    setTimeout(function () {
        toast.style.opacity = 0; // fade out
        setTimeout(function () {
            boxToasts.removeChild(toast);
        }, 3000);
    }, durationInSeconds*1000);
}