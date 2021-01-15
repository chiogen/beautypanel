import * as React from 'react'
import i18next from "i18next";
import { app } from 'photoshop';
import { BeautyPanel } from '../../../common/beautypanel';

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

export async function executeFrequencySeparation() {

    try {

        await BeautyPanel.checkBitsPerChannel();
        
        const document = app.activeDocument;
        const referenceLayer = document.backgroundLayer;

        // Check if layers exist
        let layersExist = BeautyPanel.layers.detail || BeautyPanel.layers.soft || BeautyPanel.layers.levels;
        let deleteLayers = false;
        if (layersExist) {
            // Ask user if he wants to delete layers and create new
            deleteLayers = confirm('Create new layers?')
        }

        if (!layersExist || deleteLayers) {

            // Delete layers if they exist
            BeautyPanel.layers.soft?.delete();
            BeautyPanel.layers.detail?.delete();
            BeautyPanel.layers.levels?.delete();

            await referenceLayer.duplicate(undefined, BeautyPanel.getLayerNameByCode('soft'));
            await referenceLayer.duplicate(undefined, BeautyPanel.getLayerNameByCode('detail'));
            await referenceLayer.duplicate(undefined, BeautyPanel.getLayerNameByCode('levels'));

        }

    } catch (err) {
        app.showAlert("Error at executeFrequencySeparation(): " + err)
    }

}