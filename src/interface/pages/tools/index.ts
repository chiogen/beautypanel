import { html } from 'htm/react';
import { DodgeAndBurn } from './dodge-and-burn';
import { FrequencySeparation } from './frequency-separation';
import { Hardness } from './hardness';
import { Opacity } from './opacity';

export function Tools() {
    return html`
        <div id="tools" className="page active">
            ${FrequencySeparation()}
            ${DodgeAndBurn()}
            ${Opacity()}
            ${Hardness()}
        </div>
    `;
}