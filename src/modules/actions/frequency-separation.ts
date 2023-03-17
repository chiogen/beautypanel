import { app, constants } from 'photoshop';
import { BeautyPanel } from '../../common/beautypanel';
import { percent } from '../../common/units';
import { opacityPresets } from '../../interface/pages/tools/opacity';
import { selectTool } from '../application/select-tool';
import { filterMedianNoise } from '../filter/noise/median';
import { checkBitsPerChannel } from '../image/bits-per-channel';
import { imageCalculation } from '../image/calculation';
import { selectLayers } from '../image/select-layers';
import { createAdjustmentLayer } from '../masks/levels';
import { showConfirmDialog } from '../ui/confirm';


export async function executeFrequencySeparation() {

    if (!app.activeDocument) {
        return;
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
            soft = detail = contrast = null;
        }
    }

    // Ensure the required layers exist
    if (!detail) {
        detail = await referenceLayer.duplicate();
        if (!detail)
            throw new Error('Photoshop did not create "detail" layer');

        detail.name = BeautyPanel.layerNames.detail;
    }
    if (!soft) {
        soft = await referenceLayer.duplicate();
        if (!soft)
            throw new Error('Photoshop did not create "soft" layer');


        soft.name = BeautyPanel.layerNames.soft;
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
    detail.blendMode = constants.BlendMode.LINEARLIGHT;

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

}


export async function selectLayerDetailsForFrequencySeparation() {

    const document = app.activeDocument;
    if (!document)
        return;
        
    const detail = BeautyPanel.layers.detail;
    const contrast = BeautyPanel.layers.contrast;

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

}

export async function selectLayerSoftForFrequencySeparation() {

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

}