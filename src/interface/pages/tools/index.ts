import { html } from 'htm/react';
import { DodgeAndBurn } from './dodge-and-burn';
import { FrequencySeparation } from './frequency-separation';
import { Hardness } from './hardness';
import { Opacity } from './opacity';
import { Zoom } from './zoom';

export function Tools() {
    return html`
        <div id="tools" className="page active">
            ${FrequencySeparation()}
            ${DodgeAndBurn()}
            ${Opacity()}
            ${Hardness()}
            ${Zoom()}
        </div>
    `;
}