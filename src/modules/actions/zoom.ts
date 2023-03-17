import { app } from 'photoshop';

export async function zoomToFit() {

    const [result] = await app.batchPlay([
        {
            _obj: 'select',
            _target: [
                {
                    _ref: '$Mn ',
                    _enum: '$MnIt',
                    _value: 'fitOnScreen',
                }
            ]
        }
    ], {});

    if (result.message) {
        throw new Error(result.message);
    }

}

export async function zoomPixelPerfect() {


    while (await getCurrentZoom() < 1) {
        await zoomIn();
    }

    while (await getCurrentZoom() > 1) {
        await zoomOut();
    }

}

export async function zoomIn() {

    const [result] = await app.batchPlay([
        {
            _obj: 'select',
            _target: [
                {
                    _ref: '$Mn ',
                    _enum: '$MnIt',
                    _value: 'zoomIn',
                }
            ]
        }
    ], {});

    if (result.message) {
        throw new Error(result.message);
    }

}

export async function zoomOut() {

    const [result] = await app.batchPlay([
        {
            _obj: 'select',
            _target: [
                {
                    _ref: '$Mn ',
                    _enum: '$MnIt',
                    _value: 'zoomOut',
                }
            ]
        }
    ], {});

    if (result.message) {
        throw new Error(result.message);
    }

}

async function getCurrentZoom(): Promise<number> {

    const [result] = await app.batchPlay([
        {
            _obj: 'get',
            _target: [
                {
                    _property: 'zoom'
                },
                {
                    _ref: 'document',
                    _id: app.activeDocument.id
                }
            ]
        }
    ], {});

    return result.zoom._value;
}