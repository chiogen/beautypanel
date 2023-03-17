import * as React from 'react';
import i18next from 'i18next';
import { app, Layer } from 'photoshop';
import { BeautyPanel, E_Layer } from '../../../common/beautypanel';
import { percent } from '../../../common/units';
import { opacityPresets } from './opacity';
import { filterMedianNoise } from '../../../modules/filter/noise/median';
import { selectTool } from '../../../modules/application/select-tool';
import { checkBitsPerChannel } from '../../../modules/image/bits-per-channel';
import { selectLayers } from '../../../modules/image/select-layers';
import { imageCalculation } from '../../../modules/image/calculation';
import { createAdjustmentLayer } from '../../../modules/masks/levels';
import { showConfirmDialog } from '../../../modules/ui/confirm';

export const FrequencySeparation = () => (
    <div className="section">
        <h3 className="title"> {i18next.t('frequencySeparation.long')} </h3>
        <div id="frequency-separation">
            <sp-action-button onClick={executeFrequencySeparation}>{i18next.t('frequencySeparation.short')}</sp-action-button>
            <div>
                <sp-action-button onClick={setLayerDetails}>{i18next.t('frequencySeparation.details')}</sp-action-button>
                <sp-action-button onClick={setLayerSoft}>{i18next.t('frequencySeparation.soft')}</sp-action-button>
            </div>
        </div>
    </div>
);

export async function executeFrequencySeparation(e?: React.MouseEvent) {

    if (!app.activeDocument) {
        return;
    }

    const button = (e?.currentTarget ?? e?.target) as HTMLButtonElement | undefined;

    try {

        if (button) {
            button.disabled = true;
        }

        const document = app.activeDocument;
        await checkBitsPerChannel(document);

        const referenceLayer = document.backgroundLayer ?? document.layers[0];
        referenceLayer.visible = true;

        // Get maybe existing layers
        let { detail, soft, contrast: contrast } = BeautyPanel.layers;

        // Delete layers if they exist and the user has permitted it
        if (detail || soft || contrast) {
            const deleteConfirmed = await showConfirmDialog('Create new layers?');
            if (deleteConfirmed) {
                soft?.delete();
                detail?.delete();
                contrast?.delete();
                soft = detail = contrast = undefined;
            }
        }

        // Ensure the required layers exist
        if (!detail) {
            detail = await referenceLayer.duplicate(undefined, BeautyPanel.layerNames.detail);
        }
        if (!soft) {
            soft = await referenceLayer.duplicate(undefined, BeautyPanel.layerNames.soft);
        }

        // Interpolate brightness on soft layer
        await selectLayers([soft]);
        await filterMedianNoise({ radius: 10 });

        // Image calculation
        await imageCalculation({
            sourceLayer: soft,
            targetLayer: detail,
            channel: 'RGB',
            calculationType: 'add',
            offset: 0,
            scale: 2,
            invert: true
        });
        detail.blendMode = 'linearLight';

        // Create adjustment layer (levels)
        // contrast = await LayerUtils.createContrastLayer(detail, 120, 132);
        contrast = await createAdjustmentLayer({
            levels: {
                adjustment: {
                    input: [120, 132]
                }
            }
        });
        contrast.name = BeautyPanel.layerNames.contrast;

        // Update layer visibility
        referenceLayer.visible = false;
        soft.visible = false;

        // Focus detail layer
        await selectLayers([detail]);

        // Set Brush as current tool
        // Set brush hardness to 100%
        // Set brush opacity to 100%
        await selectTool('cloneStampTool', {
            opacity: percent(100),
            useScatter: false,
            brush: {
                _obj: 'computedBrush',
                hardness: percent(100)
            }
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err);
    } finally {
        if (button) {
            button.disabled = false;
        }
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
            layer.visible = false;
        }

        await selectLayers([detail]);
        contrast.visible = true;
        detail.visible = true;

        await selectTool('cloneStampTool', {
            opacity: percent(100),
            useScatter: false,
            brush: {
                _obj: 'computedBrush',
                hardness: percent(100)
            }
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err);
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
            layer.visible = false;
        }

        await selectLayers([soft]);
        soft.visible = true;

        await selectTool('cloneStampTool', {
            opacity: percent(opacityPresets.get(1)),
            useScatter: false,
            brush: {
                _obj: 'computedBrush',
                hardness: percent(0)
            }
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err);
    }
}