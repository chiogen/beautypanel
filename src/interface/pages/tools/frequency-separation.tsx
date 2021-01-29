import * as React from 'react'
import i18next from "i18next";
import { ActionDescriptor, app, Layer } from 'photoshop';
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
                <sp-action-button onClick={setLayerDetails}>{i18next.t('frequencySeparation.details')}</sp-action-button>
                <sp-action-button onClick={setLayerSoft}>{i18next.t('frequencySeparation.soft')}</sp-action-button>
            </div>
        </div>
    </div>
    ;

export async function executeFrequencySeparation(e: React.MouseEvent<HTMLButtonElement>) {

    if (!app.activeDocument) {
        return;
    }

    const button = (e.currentTarget || e.target) as HTMLButtonElement

    try {

        button.disabled = true;

        const document = app.activeDocument;
        await DocumentUtils.checkBitsPerChannel(document);

        const referenceLayer = document.backgroundLayer ?? document.layers[0];
        referenceLayer.visible = true;

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
            soft.visible = true;
        }
        if (!detail) {
            const name = BeautyPanel.getLayerName(E_Layer.Detail);
            detail = await referenceLayer.duplicate(undefined, name);
            detail.visible = true;
        }

        // Interpolate brightness (on soft layer)
        await LayerUtils.applyMedianNoise(soft, 10);

        // Image calculation
        await LayerUtils.applyImageEvent({
            source: soft,
            target: detail,
            channel: 'RGB',
            calculationType: 'add',
            offset: 0,
            scale: 2,
            opacity: percent(100)
        });
        detail.blendMode = 'linearLight';

        // // Create adjustment layer (levels)
        levels = await LayerUtils.createContrastLayer(detail, 120, 132);
        levels.name = BeautyPanel.getLayerName(E_Layer.Levels);

        // // Update layer visibility
        referenceLayer.visible = false;
        soft.visible = false;

        // // Focus detail layer
        await DocumentUtils.setActiveLayers([detail]);

        // // Set Brush as current tool
        // // Set brush hardness to 100%
        // // Set brush opacity to 100%
        await AppUtils.selectTool('cloneStampTool', {
            hardness: percent(100),
            opacity: percent(100)
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err)
    } finally {
        button.disabled = false;
    }

}

async function setLayerDetails() {
    try {

        const layer = BeautyPanel.layers.detail;

        if (layer) {
            await DocumentUtils.setActiveLayers([layer]);
        } else {
            const layerName = BeautyPanel.getLayerName(E_Layer.Detail);
            await app.showAlert(`Layer '${layerName}' not found.`);
        }

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err)
    }
}

async function setLayerSoft() {
    try {

        const layer = BeautyPanel.layers.soft;
        if (layer) {
            await DocumentUtils.setActiveLayers([layer]);
        } else {
            const layerName = BeautyPanel.getLayerName(E_Layer.Soft);
            await app.showAlert(`Layer '${layerName}' not found.`)
        }

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err)
    }
}