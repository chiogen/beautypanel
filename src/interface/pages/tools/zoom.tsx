import * as React from 'react'
import i18next from "i18next";
import { app } from 'photoshop'
import { selectTool, _selectTool } from "../../../common/app-utils";
import { ActionDescriptor } from 'photoshop';

export const Zoom = () => (
    <div className="section">
        <h3 className="title">${i18next.t('zoom')}</h3>
        <div className="flex-buttons">
            <sp-action-button onClick={zoomFit}>{i18next.t('zoomFit')}</sp-action-button>
            <sp-action-button onClick={zoomOut}>-</sp-action-button>
            <sp-action-button onClick={zoomPixelPerfect}>100%</sp-action-button>
            <sp-action-button onClick={zoomIn}>+</sp-action-button>
        </div>
    </div>
);

async function useZoomTool(actions: ActionDescriptor[]) {

    const returnToolId = app.currentTool.id;

    try {

        const results = await app.batchPlay([
            _selectTool('zoomTool'),
            ...actions
        ]);

        for (const result of results) {
            if (result.message) {
                throw new Error(result.message);
            }
        }

    } catch (err) {
        await app.showAlert(err.message);
    } finally {
        await selectTool(returnToolId);
    }

}

function zoomFit(_e: React.MouseEvent<HTMLButtonElement>) {
    return useZoomTool([{
        _obj: 'invokeCommand',
        commandID: 1192,
        kcanDispatchWhileModal: true
    }])
}

function zoomPixelPerfect(_e: React.MouseEvent<HTMLButtonElement>) {
    return useZoomTool([{
        _obj: 'invokeCommand',
        commandID: 1190,
        kcanDispatchWhileModal: true,
        _isCommand: false
    }])
}

function zoomIn(_e: React.MouseEvent<HTMLButtonElement>) {
    return useZoomTool([{
        _obj: 'invokeCommand',
        commandID: 1004,
        kcanDispatchWhileModal: true,
        _isCommand: false
    }])
}

function zoomOut(_e: React.MouseEvent<HTMLButtonElement>) {
    return useZoomTool([{
        _obj: 'invokeCommand',
        commandID: 1005,
        // kcanDispatchWhileModal: true,
        _isCommand: false
    }])
}