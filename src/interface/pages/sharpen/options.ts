import { html } from "htm/react";

export const Options = () => html`
    <div className="section">
        <h3 className="title">Options</h3>
        <div id="sharpen-options">
            <sp-checkbox>Switch to 'Detail' Layer</sp-checkbox>
        </div>
    </div>
`;