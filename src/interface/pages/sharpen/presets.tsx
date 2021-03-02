import * as React from "react"
import i18next from "i18next";
import { Heading } from "@adobe/react-spectrum";

export const Presets = () => 
    <div className="section presets">
        <Heading># {i18next.t("sharpen.presets")}</Heading>
        <div className="buttons">
            <sp-action-button>
                0.5
                <br />
                35%
            </sp-action-button>            
            <sp-action-button>
                1
                <br />
                100%
            </sp-action-button>            
            <sp-action-button>
                1.5
                <br />
                100%
            </sp-action-button>            
            <sp-action-button>                1
                <br />
                200%
            </sp-action-button>            
            <sp-action-button>
                1.5
                <br />
                200%
            </sp-action-button>            
            <sp-action-button>
                <span>2</span>
                <br />
                <span>200%</span>
            </sp-action-button>
        </div>
    </div>