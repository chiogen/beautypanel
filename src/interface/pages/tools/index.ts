import { html } from 'htm/react';

export function Tools() {
    return html`
        <div id="tools" className="page active">
            <div id="tools-general">
                <div id="tools-general-grid">
                    <div>
                        <sp-button locale="frequencySeparation"></sp-button>
                        <sp-button locale="dodgeAndBurnGradient"></sp-button>
                    </div>
                    <div>
                        <sp-button locale="vignette"></sp-button>
                        <sp-button locale="dodgeAndBurnGray"></sp-button>
                    </div>
                </div>
                <div>
                    <sp-button locale="saveJpg2048"></sp-button>
                </div>
            </div>
            <hr />
            <div id="tools-shortcuts">
                <img width="24" height="24" src="icons/ic_brush_white_48dp_1x.png" />
                <img width="24" height="24" src="icons/stamp-opac.png" />
            </div>
            <hr />
            <div id="tools-opacity">
                <div className="title" locale="opacity"></div>
                <div className="profiles">
                    <sp-button id="tools-opacity-profile-1" index="0">2%</sp-button>
                    <sp-button id="tools-opacity-profile-2" index="1">6%</sp-button>
                    <sp-button id="tools-opacity-profile-3" index="2">32%</sp-button>
                    <sp-button id="tools-opacity-profile-4" index="3">50%</sp-button>
                    <sp-button id="tools-opacity-profile-5" index="4">100%</sp-button>
                </div>
            </div>
            <hr />
            <div id="tools-hardness">
                <div className="title" locale="hardness"></div>
                <div className="profiles">
                    <sp-button id="tools-hardness-profile-1" index="0">0%</sp-button>
                    <sp-button id="tools-hardness-profile-2" index="1">25%</sp-button>
                    <sp-button id="tools-hardness-profile-3" index="2">50%</sp-button>
                    <sp-button id="tools-hardness-profile-4" index="3">75%</sp-button>
                    <sp-button id="tools-hardness-profile-5" index="4">100%</sp-button>					
                </div>
            </div>
        </div>
    `;
}