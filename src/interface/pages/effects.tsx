import i18next from 'i18next';
import { app, constants } from 'photoshop';
import { Layer } from 'photoshop/dom/Layer';
import * as React from 'react';
import { BeautyPanel, E_Layer } from '../../common/beautypanel';
import { DialogOptions } from '../../enums/dialog-options';
import { filterGaussianBlur } from '../../modules/filter/blur/gaussian-blur';
import { surfaceBlur } from '../../modules/filter/blur/surface-blur';
import { checkBitsPerChannel } from '../../modules/image/bits-per-channel';
import { mergeLayers } from '../../modules/image/merge-layers';
import { invert } from '../../modules/layer/invert';
import { createAdjustmentLayer } from '../../modules/masks/levels';
import { createRevealAllMask } from '../../modules/masks/reveal-all';
import { createAutumnEffect, createSpringEffect } from './effects/season';
import { createVignette } from './effects/vignette';

type Props = {
    isActive: boolean
};


export class Effects extends React.Component<Props> {

    render() {

        const style: React.CSSProperties = {};
        if (!this.props.isActive) {
            style.display = 'none';
        }

        return <div id="effects" className="page" style={style}>
            <sp-action-button onClick={enhanceDetails}># {i18next.t('effects.enhanceDetails')}</sp-action-button>
            <sp-action-button onClick={strengthenDetails}># {i18next.t('effects.strengthenDetails')}</sp-action-button>
            <sp-action-button onClick={createOrthonEffect}># {i18next.t('effects.orton')}</sp-action-button>
            <sp-action-button onClick={createVignette}># {i18next.t('effects.vignette')}</sp-action-button>
            <sp-action-button onClick={createAutumnEffect}>{i18next.t('effects.autumn')}</sp-action-button>
            <sp-action-button onClick={createSpringEffect}># {i18next.t('effects.spring')}</sp-action-button>
        </div>;
    }

}

async function enhanceDetails(e: React.MouseEvent<HTMLButtonElement>) {

    if (!app.activeDocument)
        return;

    try {

        const document = app.activeDocument;
        const referenceLayer = document.backgroundLayer!;

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

        tempLayer = await mergeLayers(document, [tempLayer, tempLayer2]);

        // Invert reference layer
        const inverted = await tempLayer!.duplicate();
        await invert(inverted);
        inverted!.blendMode = constants.BlendMode.VIVIDLIGHT;
        await surfaceBlur(inverted, 24, 26);

        // Merge layers and finalize action
        const enhanceDetails = await mergeLayers(document, [tempLayer, inverted]);
        enhanceDetails.name = BeautyPanel.getLayerName(E_Layer.EnhanceDetails);
        enhanceDetails.blendMode = constants.BlendMode.OVERLAY;
        enhanceDetails.opacity = 50;

        // enhanceDetails.moveBelow(referenceLayer);
        await createRevealAllMask({
            layer: enhanceDetails
        });

    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }
}

async function strengthenDetails(e: React.MouseEvent<HTMLButtonElement>) {
    try {



    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }
}

async function createOrthonEffect(e: React.MouseEvent<HTMLButtonElement>) {
    try {

        const document = app.activeDocument;
        if (!document || !document.backgroundLayer) {
            return;
        }

        let orthonLayer: Layer;
        const soft = BeautyPanel.layers.soft;
        const detail = BeautyPanel.layers.detail;

        if (soft && detail) {
            const detailCopy = await detail.duplicate();
            const softCopy = await soft.duplicate();
            orthonLayer = await mergeLayers(document, [detailCopy, softCopy]);
        } else {
            orthonLayer = await document.backgroundLayer.duplicate();
        }

        orthonLayer.name = BeautyPanel.layerNames.orton;
        orthonLayer.blendMode = constants.BlendMode.NORMAL;
        orthonLayer.opacity = 50;

        await filterGaussianBlur(5, DialogOptions.Display);
        await createAdjustmentLayer({
            levels: {
                adjustment: {}
            }
        });

    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }
}