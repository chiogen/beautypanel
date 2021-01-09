import { html } from "htm/react";
import i18next from "i18next";

export const Zoom = () => html`
    <div className="section">
        <h2>${i18next.t('zoom')}</h2>
        <div className="flex-buttons">
            <sp-action-button>${i18next.t('zoomFit')}</sp-action-button>
            <sp-action-button>-</sp-action-button>
            <sp-action-button>100%</sp-action-button>
            <sp-action-button>+</sp-action-button>
        </div>
    </div>
`;