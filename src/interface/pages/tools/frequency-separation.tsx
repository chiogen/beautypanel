import * as React from 'react'
import i18next from "i18next";
import { app } from 'photoshop';
import { BeautyPanel } from '../../../common/beautypanel';
import { LayerUtils } from '../../../common/layer-utils';
import { DocumentUtils } from '../../../common/document-utils';

export const FrequencySeparation = () => 
    <div className="section">
        <h3 className="title">${i18next.t('frequencySeparation.long')}</h3>
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

        await BeautyPanel.checkBitsPerChannel();
        
        const document = app.activeDocument;
        const referenceLayer = document.backgroundLayer;

        // Check if layers exist
        let { detail, soft, levels } = BeautyPanel.layers;
        
        // Delete layers if they exist and the user has permitted it
        if (detail || soft || levels) {
            if (confirm('Create new layers?')) {
                soft?.delete();
                detail?.delete();
                levels?.delete();
            }
        }

        // Ensure the required layers exist
        if (!soft) {
            soft = await referenceLayer.duplicate(undefined, BeautyPanel.getLayerNameByCode('soft'));
        }
        if (!detail) {
            detail = await referenceLayer.duplicate(undefined, BeautyPanel.getLayerNameByCode('detail'));
        }

        // ToDO - Interpolate brightness (on soft layer) (median noise 10.0)

        // Picture calculation
        LayerUtils.applyCalculation(detail, soft, 'RGB ', true, 'Add ', 2, 0);
        detail.blendMode = 'linearlight';

        // Create adjustment layer (levels)
        levels = await LayerUtils.createContrastLayer(detail, 120, 132);
        levels.name = BeautyPanel.getLayerNameByCode('levels');

        // Update layer visibility
        referenceLayer.visible = false;
        soft.visible = false;

        DocumentUtils.setActiveLayers([detail]);

        await postFrequencySeparation();

    } catch (err) {
        app.showAlert("Error at executeFrequencySeparation(): " + err?.message ?? err)
    } finally {
        button.disabled = false;
    }

}

async function postFrequencySeparation() {
    try {

        const targetBrush = "cloneStampTool";

        // Set Brush as current tool

        // Set brush hardness to 100%

        // Set brush opacity to 100%

    } catch (err) {
        app.showAlert(err?.message ?? err)
    }
}