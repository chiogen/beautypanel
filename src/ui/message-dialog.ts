import i18next from 'i18next';

export function showMessageDialog(message: string) {

    const dialog = document.createElement('dialog');
    dialog.style.backgroundColor = '#444';
    document.body.appendChild(dialog);

    const content = document.createElement('p');
    content.innerHTML = message;
    content.style.color = 'white';
    dialog.appendChild(content);

    const actions = document.createElement('div');
    actions.classList.add('actions');
    dialog.appendChild(actions);

    const btnClose = document.createElement('sp-action-button');
    btnClose.textContent = i18next.t('close');
    actions.appendChild(btnClose);

    dialog.showModal();

    return new Promise<void>((fulfill) => {

        btnClose.addEventListener('click', e => {
            if (e.button !== 0)
                return;
            dialog.close();
            setTimeout(() => dialog.remove(), 500);
            fulfill();
        });

    });
}