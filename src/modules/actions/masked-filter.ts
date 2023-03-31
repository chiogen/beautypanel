import { BeautyPanel } from '../../common/beautypanel';
import { store } from '../../store';
import { selectLayers } from '../image/select-layers';

export async function executeMaskedFilter() {

    const { sharpenOptions } = store.getState();
    const detail = BeautyPanel.layers.detail;

    if (detail && sharpenOptions.useDetailLayer) {
        await selectLayers([detail], true);
    }

    throw new Error('Masked Filter is not implemented yet');

}