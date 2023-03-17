import { app } from 'photoshop';
import { BeautyPanel } from '../../common/beautypanel';
import { percent } from '../../common/units';
import { opacityPresets } from '../../interface/pages/tools/opacity';
import { selectTool } from '../application/select-tool';
import { selectLayers } from '../image/select-layers';

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