import { app, constants } from 'photoshop';
import { Layer } from 'photoshop/dom/Layer';
import { BeautyPanel, E_Layer } from '../../common/beautypanel';
import { DialogOptions } from '../../enums/dialog-options';
import { duplicateReferenceLayer, duplicateReferenceLayerIntoSmartObject } from '../document/duplicate-reference-layer';
import { filterGaussianBlur } from '../filter/blur/gaussian-blur';
import { surfaceBlur } from '../filter/blur/surface-blur';
import { checkBitsPerChannel } from '../image/bits-per-channel';
import { mergeLayers } from '../image/merge-layers';
import { invert } from '../layer/invert';
import { createAdjustmentLayer } from '../masks/levels';
import { createRevealAllMask } from '../masks/reveal-all';
import { moveLayerToTop } from '../layer/move-layer-to-top';

export async function executeEnhanceDetailsEffect() {

    const document = app.activeDocument;
    const referenceLayer = document.backgroundLayer ?? document.layers[0];

    referenceLayer.visible = true;
    // referenceLayer.locked = true;

    // Preparations
    await checkBitsPerChannel(document);

    // Delete layers if they exist and the user has permitted it
    if (BeautyPanel.layers.enhanceDetails) {
        if (confirm('Overwrite existing layers?')) {
            BeautyPanel.layers.enhanceDetails.delete();
        } else {
            return;
        }
    }

    // Create reference layer
    let tempLayer = await referenceLayer.duplicate();
    tempLayer!.opacity = 1;
    const tempLayer2 = await referenceLayer.duplicate();

    tempLayer = await mergeLayers(document, [tempLayer!, tempLayer2!]);

    // Invert reference layer
    const inverted = await tempLayer!.duplicate() as Layer;
    await invert(inverted);
    inverted!.blendMode = constants.BlendMode.VIVIDLIGHT;
    await surfaceBlur(inverted, 24, 26);

    // Merge layers and finalize action
    const enhanceDetails = await mergeLayers(document, [tempLayer, inverted]);
    enhanceDetails.name = BeautyPanel.getLayerName(E_Layer.EnhanceDetails);
    enhanceDetails.blendMode = constants.BlendMode.OVERLAY;
    enhanceDetails.opacity = 50;

    // enhanceDetails.moveBelow(referenceLayer);
    await createRevealAllMask(enhanceDetails);

}

export async function createOrthonEffectLayerFromV1() {

    const document = app.activeDocument;
    if (!document)
        throw new Error('No document active.');

    const orthonLayer = await duplicateReferenceLayer(document);
    orthonLayer.name = BeautyPanel.layerNames.orton;
    orthonLayer.blendMode = constants.BlendMode.NORMAL;
    orthonLayer.opacity = 50;
    await filterGaussianBlur(5, DialogOptions.Display);

    const revealAllLayer = await createRevealAllMask(orthonLayer);

    moveLayerToTop(orthonLayer);

    const group = await document.groupLayers([orthonLayer, revealAllLayer]);
    group!.name = BeautyPanel.layerNames.orton;

}

export async function executeCreateOrthonLayer() {

    const document = app.activeDocument;
    if (!document)
        throw new Error('No document active.');

    const baselayer = await duplicateReferenceLayer(document);
    baselayer.name = BeautyPanel.layerNames.orton;
    baselayer.blendMode = constants.BlendMode.NORMAL;
    baselayer.opacity = 50;
    baselayer.name = 'base';
    await filterGaussianBlur(5, DialogOptions.Display);

    const adjustmentLayer = await createAdjustmentLayer({
        levels: {
            adjustment: {}
        }
    });

    const group = await document.groupLayers([baselayer, adjustmentLayer]);
    group!.name = BeautyPanel.layerNames.orton;

}

export async function executeOrthonEffectSmart() {
    // Source: https://youtu.be/hgcHDHzfr2Q

    const document = app.activeDocument;
    if (!document)
        throw new Error('No document active.');

    const detailsLayer = await duplicateReferenceLayerIntoSmartObject(document);
    const blurLayer = await duplicateReferenceLayerIntoSmartObject(document);

    await blurLayer.applyGaussianBlur(25);
    blurLayer.blendMode = constants.BlendMode.SCREEN;
    blurLayer.name = 'Orthon Blur';

    await detailsLayer.applyHighPass(10);
    detailsLayer.blendMode = constants.BlendMode.SOFTLIGHT;
    detailsLayer.name = 'Orthon Details';

    const group = await document.groupLayers([detailsLayer, blurLayer]);
    group!.name = BeautyPanel.layerNames.orton;

}