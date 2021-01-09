import { Divider } from "@adobe/react-spectrum";
import { html } from "htm/react";
import i18next from "i18next";

export const DodgeAndBurn = () => html`
    <div>
        <h2>Dodge and Burn</h2>
        <${Divider} size="medium" />
        <div id="dodge-and-burn">
            <div>
                <sp-action-button>${i18next.t('dodgeAndBurn.gradient')}</sp-action-button>
                <sp-action-button>${i18next.t('dodgeAndBurn.default')}</sp-action-button>
            </div>
            <div>
                <sp-action-button class="white">${i18next.t('dodgeAndBurn.white')}</sp-action-button>
                <sp-action-button class="gray">${i18next.t('dodgeAndBurn.gray')}</sp-action-button>
                <sp-action-button class="black">${i18next.t('dodgeAndBurn.black')}</sp-action-button>
            </div>
            <div>
                <sp-action-button>Brush</sp-action-button>
                <sp-action-button>Stamp</sp-action-button>
            </div>
        </div>
    </div>
`;