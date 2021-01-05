
const errorElementId = 'error-panel';
const errorMessageId = 'error-message';
const errorCloseButtonId = "error-action-close";

export function showErrorMessage(message: string) {
    const panel = document.getElementById(errorElementId);
    if (panel) {
        panel.hidden = false;
    }

    const messageElement = document.getElementById(errorMessageId);
    if (messageElement) {
        messageElement.innerHTML = message;
    }
}

export function closeErrorMesage() {
    const el = document.getElementById(errorElementId);
    if (el) {
        el.hidden = true;
    }
}