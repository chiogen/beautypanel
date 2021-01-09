import { Divider } from "@adobe/react-spectrum";
import { html } from "htm/react";
import i18next from "i18next";

export const Zoom = () => html`
    <div>
        <h2>${i18next.t('zoom')}</h2>
        <${Divider} size="medium" />
        <div className="flex-buttons">
            <sp-action-button>${i18next.t('zoomFit')}</sp-action-button>
            <sp-action-button>-</sp-action-button>
            <sp-action-button>100%</sp-action-button>
            <sp-action-button>+</sp-action-button>
        </div>
    </div>
`;