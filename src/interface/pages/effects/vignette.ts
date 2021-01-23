import { app } from "photoshop";
import { BeautyPanel, E_Layer } from "../../../common/beautypanel";
import { DocumentUtils } from "../../../common/document-utils";


export async function createVignette(e: React.MouseEvent<HTMLButtonElement>) {
    try {

        const document = app.activeDocument;
        const referenceLayer = app.activeDocument.backgroundLayer;

        referenceLayer.visible = true;
        await DocumentUtils.checkBitsPerChannel(document);

        // Options
        let layer = BeautyPanel.layers.vignette;
        const opacity = 25;

        // Delete existing layer
        if (layer) {
            layer.delete();
            layer = undefined;
        }

        layer = await document.createLayer({
            name: BeautyPanel.getLayerName(E_Layer.Vignette),
            opacity: 100,
            mode: 'normal'
        });

        await createElipse();


    } catch (err) {
        const message = err.message || err;
        await app.showAlert(message);
    }
}

async function createElipse() {

}