import { html } from 'htm/react';
import { Filter } from './filter';

export function Sharpen() {
    return html`
        <div id="sharpen" className="page">
            ${Filter()}
        </div>
    `;
}