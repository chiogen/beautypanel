import { core } from 'photoshop';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { handleException } from '../../../common/errors/handle-error';
import { setColorForDodgeAndBurn } from '../../../modules/actions/dodge-and-burn';
import { TState } from '../../../store';
import i18next from 'i18next';

export const DodgeAndBurnColorSelection = () => {

    const color = useSelector<TState, string>(state => state.tools.dodgeAndBurn.color);

    const white: React.CSSProperties = {
        backgroundColor: 'white',
        color: 'black'
    };
    const gray: React.CSSProperties = {
        backgroundColor: 'gray',
        color: 'white'
    };
    const black: React.CSSProperties = {
        backgroundColor: 'black',
        color: 'white'
    };

    switch (color) {
        case 'white':
            white.outline = '2px solid red';
            break;
        case 'gray':
            gray.outline = '2px solid red';
            break;
        case 'black':
            black.outline = '2px solid red';
            break;
    }

    return (
        <div className="flex stretch">
            <sp-action-button data-color="white" style={white} onClick={setColorFodDodgeAndBurnListener}>{i18next.t('dodgeAndBurn.white')}</sp-action-button>
            <sp-action-button data-color="gray" style={gray} onClick={setColorFodDodgeAndBurnListener}>{i18next.t('dodgeAndBurn.gray')}</sp-action-button>
            <sp-action-button data-color="black" style={black} onClick={setColorFodDodgeAndBurnListener}>{i18next.t('dodgeAndBurn.black')}</sp-action-button>
        </div>
    );
};

async function setColorFodDodgeAndBurnListener(e: React.MouseEvent<HTMLButtonElement>) {
    try {

        const button = e.target as HTMLButtonElement;
        const colorCode = button.dataset.color;

        if (colorCode) {
    
            await core.executeAsModal(setColorForDodgeAndBurn(colorCode), {
                commandName: 'Select Dodge And Burn Color ' + colorCode
            });
        }

    } catch (err) {
        await handleException(err);
    }
}