import { app, core } from 'photoshop';
import { BeautyPanel } from '../common/beautypanel';
import { moveLayerToTop } from '../modules/layer/move-layer-to-top';
import i18next from 'i18next';

setTimeout(checkCopyrightLayer, 1000);

async function checkCopyrightLayer() {

    const document = app.activeDocument;
    const copyright = BeautyPanel.layers.copyright;

    if (!copyright)
        return;

    if (document.layers[0].id !== copyright.id) {

        await core.executeAsModal(async () => {
            moveLayerToTop(copyright);
        }, {
            commandName: i18next.t('actions.moveLayerToTop')
        });


    }

    setTimeout(checkCopyrightLayer, 1000);

}