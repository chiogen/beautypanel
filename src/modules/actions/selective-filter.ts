import { BeautyPanel } from '../../common/beautypanel';
import { DialogOptions } from '../../enums/dialog-options';
import { store } from '../../store';
import { filterSmartSharpen } from '../filter/sharpen/smart-sharpen';
import { selectLayers } from '../image/select-layers';

export async function executeSelectiveFilter() {

    const { sharpenOptions } = store.getState();
    const detail = BeautyPanel.layers.detail;

    if (detail && sharpenOptions.useDetailLayer) {
        await selectLayers([detail], true);
    }

    await filterSmartSharpen({
        amount: 100,
        radius: 2,
        noiseReduction: 20,
        shadowMode: {
            amount: 20,
            width: 50,
            radius: 20
        },
        highlightMode: {
            amount: 20,
            width: 50,
            radius: 20
        },
        dialogOptions: DialogOptions.Display
    });

}