import { app, constants } from 'photoshop';
import { BeautyPanel, E_Layer } from '../../common/beautypanel';
import { DialogOptions } from '../../enums/dialog-options';
import { filterUnsharpMask } from '../filter/sharpen/unsharp-mask';
import { imageCalculation } from '../image/calculation';
import { imageDesaturation } from '../image/desaturate';
import { mergeLayers } from '../image/merge-layers';
import { selectLayers } from '../image/select-layers';
import { executeFrequencySeparation } from './frequency-separation';

export async function executeFreqSeparationFilter() {

    const document = app.activeDocument;
    if (!document) {
        return;
    }

    const { detailColor, detailBlackWhite, soft } = await prepareLayers();

    await imageDesaturation(detailBlackWhite);
    await imageCalculation({
        sourceLayer: detailColor,
        targetLayer: detailBlackWhite,
        calculationType: 'add',
        channel: 'RGB',
        invert: true,
        scale: 2,
        offset: 0
    });

    await selectLayers([detailBlackWhite]);
    await filterUnsharpMask({
        dialogOptions: DialogOptions.Display
    });

    const mergedLayer = await mergeLayers(document, [
        detailBlackWhite,
        detailColor,
        soft
    ]);

    mergedLayer.name = 'Frequency Separation Filter';
    // mergedLayer.delete();

}

async function prepareLayers() {

    let detail = BeautyPanel.layers.detail;
    let soft = BeautyPanel.layers.soft;

    // Run frequency separation if it isn't done yet
    if (!detail || !soft) {
        await executeFrequencySeparation();
        detail = BeautyPanel.layers.detail!;
        soft = BeautyPanel.layers.soft!;
    }

    const detailBlackWhite = await detail.duplicate();
    if (!detailBlackWhite)
        throw new Error('Photoshop did not duplicate "DetailBlackWhite" layer.');

    detailBlackWhite.name = BeautyPanel.getLayerName(E_Layer.DetailBlackWhite);
    detailBlackWhite.blendMode = constants.BlendMode.LINEARLIGHT;

    const detailColor = detail;
    detailColor.name = BeautyPanel.getLayerName(E_Layer.DetailColor);

    return {
        detailBlackWhite,
        detailColor,
        soft
    };
}