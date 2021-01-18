import * as React from 'react'
import i18next from "i18next";
import { app } from 'photoshop';
import { BeautyPanel, E_Layer } from '../../../common/beautypanel';
import { LayerUtils } from '../../../common/layer-utils';
import { DocumentUtils } from '../../../common/document-utils';
import { confirm } from '../../dialogues/confirm';
import { AppUtils } from '../../../common/app-utils';
import { percent } from '../../../common/type-utils';

export const FrequencySeparation = () => 
    <div className="section">
        <h3 className="title">{i18next.t('frequencySeparation.long')}</h3>
        <div id="frequency-separation">
            <sp-action-button onClick={executeFrequencySeparation}>{i18next.t('frequencySeparation.short')}</sp-action-button>
            <div>
                <sp-action-button>{i18next.t('frequencySeparation.details')}</sp-action-button>
                <sp-action-button>{i18next.t('frequencySeparation.soft')}</sp-action-button>
            </div>
        </div>
    </div>
;

export async function executeFrequencySeparation(e: React.MouseEvent<HTMLButtonElement>) {

    const button = (e.currentTarget || e.target) as HTMLButtonElement

    try {

        button.disabled = true;

        await DocumentUtils.checkBitsPerChannel();
        
        const document = app.activeDocument;
        const referenceLayer = document.backgroundLayer;

        // Get maybe existing layers
        let { detail, soft, levels } = BeautyPanel.layers;
        
        // Delete layers if they exist and the user has permitted it
        if (detail || soft || levels) {
            if (confirm('Create new layers?')) {
                soft?.delete();
                detail?.delete();
                levels?.delete();
                soft = detail = levels = undefined;
            }
        }

        // Ensure the required layers exist
        if (!soft) {
            const name = BeautyPanel.getLayerName(E_Layer.Soft);
            soft = await referenceLayer.duplicate(undefined, name);
        }
        if (!detail) {
            const name = BeautyPanel.getLayerName(E_Layer.Detail);
            detail = await referenceLayer.duplicate(undefined, name);
        }

        // Interpolate brightness (on soft layer)
        await LayerUtils.applyMedianNoise(soft, 10);

        // Picture calculation
        await DocumentUtils.setActiveLayers([detail]);
        await LayerUtils.applyCalculation(detail, soft, /*'RGB '*/ "red", true, "add", 2, 0);
        detail.blendMode = 'linearLight';

        // Create adjustment layer (levels)
        await DocumentUtils.setActiveLayers([detail]);
        levels = await LayerUtils.createContrastLayer(120, 132);
        levels.name = BeautyPanel.getLayerName(E_Layer.Levels);

        // Update layer visibility
        referenceLayer.visible = false;
        soft.visible = false;

        // Focus detail layer
        await DocumentUtils.setActiveLayers([detail]);

        // Set Brush as current tool
        // Set brush hardness to 100%
        // Set brush opacity to 100%
        await AppUtils.selectTool('cloneStampTool', {
            hardness: percent(100),
            opacity: percent(100)
        });

    } catch (err) {
        app.showAlert("Error at executeFrequencySeparation(): " + err?.message ?? err)
    } finally {
        button.disabled = false;
    }

}