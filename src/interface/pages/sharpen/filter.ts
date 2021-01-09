import { html } from "htm/react";

export const Filter = () => html`
    <div className="section">
        <h3>Filterauswahl</h3>
        <div className="flex-buttons">
            <sp-action-button>Unscharf</sp-action-button>
            <sp-action-button>Selektiv</sp-action-button>
        </div>
        <div className="flex-buttons">
            <sp-action-button>FreqT</sp-action-button>
            <sp-action-button>Maskiert</sp-action-button>
        </div>      
    </div>
`