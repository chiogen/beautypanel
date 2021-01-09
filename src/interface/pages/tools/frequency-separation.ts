import { html } from "htm/react";
import i18next from "i18next";

export const FrequencySeparation = () => html`
    <div className="section">
        <h3 className="title">Frequency Separation</h3>
        <div id="frequency-separation">
            <sp-action-button>${i18next.t('frequencySeparation.default')}</sp-action-button>
            <div>
                <sp-action-button>${i18next.t('frequencySeparation.details')}</sp-action-button>
                <sp-action-button>${i18next.t('frequencySeparation.soft')}</sp-action-button>
            </div>
        </div>
    </div>
`;