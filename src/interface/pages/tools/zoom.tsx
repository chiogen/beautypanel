import * as React from 'react'
import i18next from "i18next";
import { app } from 'photoshop'

export const Zoom = () => (
    <div className="section">
        <h3 className="title">{i18next.t('zoom')}</h3>
        <div className="flex stretch">
            <sp-action-button onClick={zoomFit}>{i18next.t('zoomFit')}</sp-action-button>
            <sp-action-button onClick={zoomOut}>-</sp-action-button>
            <sp-action-button onClick={zoomPixelPerfect}>100%</sp-action-button>
            <sp-action-button onClick={zoomIn}>+</sp-action-button>
        </div>
    </div>
);

async function zoomFit() {
    try {
        if (!app.activeDocument)
            return;

        const [result] = await app.batchPlay([
            {
                _obj: "select",
                _target: [
                    {
                        _ref: '$Mn ',
                        _enum: "$MnIt",
                        _value: "fitOnScreen",
                    }
                ]
            }
        ]);

        if (result.message) {
            throw new Error(result.message);
        }

    } catch (err) {
        await app.showAlert(err.message);
    }
}

async function zoomPixelPerfect() {
    try {
        if (!app.activeDocument)
            return;

        while (await getCurrentZoom() < 1) {
            await zoomIn();
        }

        while (await getCurrentZoom() > 1) {
            await zoomOut();
        }

    } catch (err) {
        await app.showAlert(err.message);
    }
}

async function zoomIn() {
    try {
        if (!app.activeDocument)
            return;

        const [result] = await app.batchPlay([
            {
                _obj: "select",
                _target: [
                    {
                        _ref: '$Mn ',
                        _enum: "$MnIt",
                        _value: "zoomIn",
                    }
                ]
            }
        ]);

        if (result.message) {
            throw new Error(result.message);
        }

    } catch (err) {
        await app.showAlert(err.message);
    }
}

async function zoomOut() {
    try {
        if (!app.activeDocument)
            return;

        const [result] = await app.batchPlay([
            {
                _obj: "select",
                _target: [
                    {
                        _ref: '$Mn ',
                        _enum: "$MnIt",
                        _value: "zoomOut",
                    }
                ]
            }
        ]);

        if (result.message) {
            throw new Error(result.message);
        }

    } catch (err) {
        await app.showAlert(err.message);
    }
}

async function getCurrentZoom(): Promise<number> {

    if (!app.activeDocument) {
        throw new Error('No document active.');
    }

    const [result] = await app.batchPlay([
        {
            _obj: 'get',
            _target: [
                {
                    _property: 'zoom'
                },
                {
                    _ref: 'document',
                    _id: app.activeDocument._id
                }
            ]
        }
    ])

    return (result as any).zoom._value;
}