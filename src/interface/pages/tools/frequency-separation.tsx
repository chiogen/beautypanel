import * as React from 'react'
import i18next from "i18next";
import { app, Layer } from 'photoshop';
import { BeautyPanel, E_Layer } from '../../../common/beautypanel';
import { LayerUtils } from '../../../common/layer-utils';
import { DocumentUtils } from '../../../common/document-utils';
import { confirm } from '../../dialogues/confirm';
import { AppUtils } from '../../../common/app-utils';
import { percent } from '../../../common/type-utils';
import { getOpacityPresetValue } from './opacity'

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
        let { detail, soft, contrast: contrast } = BeautyPanel.layers;

        // Delete layers if they exist and the user has permitted it
        if (detail || soft || contrast) {
            if (confirm('Create new layers?')) {
                soft?.delete();
                detail?.delete();
                contrast?.delete();
                soft = detail = contrast = undefined;
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

        // Interpolate brightness on soft layer
        await LayerUtils.applyMedianFilter(soft, 9);

        // Image calculation
        await LayerUtils.applyImageEvent({
            source: soft,
            target: detail,
            channel: 'RGB',
            calculationType: 'add',
            offset: 0,
            scale: 2,
            opacity: percent(100),
            invert: true
        });
        detail.blendMode = 'linearLight';

        // Create adjustment layer (levels)
        contrast = await LayerUtils.createContrastLayer(detail, 120, 132);
        contrast.name = BeautyPanel.getLayerName(E_Layer.Contrast);

        // Update layer visibility
        referenceLayer.visible = false;
        soft.visible = false;

        // Focus detail layer
        await DocumentUtils.selectLayers([detail]);

        // Set Brush as current tool
        // Set brush hardness to 100%
        // Set brush opacity to 100%
        await AppUtils.selectTool('cloneStampTool', {
            opacity: percent(100),
            useScatter: false,
            brush: {
                _obj: "computedBrush",
                hardness: percent(100)
            }
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

        const document = app.activeDocument;
        const detail = BeautyPanel.layers.detail;
        const contrast = BeautyPanel.layers.contrast;

        if (!document)
            return;
        if (!detail || !contrast) {
            app.showAlert('You must run FrequencySeparation first.');
            return;
        }


        for (const layer of document.layers) {
            layer.visible = layer === contrast;
        }

        await DocumentUtils.selectLayers([detail], true);

        await AppUtils.selectTool('cloneStampTool', {
            opacity: percent(100),
            useScatter: false,
            brush: {
                _obj: "computedBrush",
                hardness: percent(100)
            }
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err)
    }
}

async function setLayerSoft() {
    try {

        const document = app.activeDocument;
        const soft = BeautyPanel.layers.soft;
        const contrast = BeautyPanel.layers.contrast;

        if (!document)
            return;
        if (!soft || !contrast) {
            app.showAlert('You must run FrequencySeparation first.');
            return;
        }


        for (const layer of document.layers) {
            layer.visible = layer === contrast;
        }

        await DocumentUtils.selectLayers([soft], true);

        await AppUtils.selectTool('cloneStampTool', {
            opacity: percent(getOpacityPresetValue(1)),
            useScatter: false,
            brush: {
                _obj: "computedBrush",
                hardness: percent(0)
            }
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err)
    }
}