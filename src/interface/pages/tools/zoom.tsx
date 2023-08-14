import * as React from 'react';
import i18next from 'i18next';
import { app, core } from 'photoshop';
import { zoomIn, zoomOut, zoomPixelPerfect, zoomToFit } from '../../../modules/actions/zoom';
import { Card } from '../../../components/card';

export const Zoom = () => (
    <Card title={i18next.t('zoom')} contentStyle='inline-stretch'>
        <sp-action-button onClick={zoomFit}>{i18next.t('zoomFit')}</sp-action-button>
        <sp-action-button onClick={onZoomOutClicked}>-</sp-action-button>
        <sp-action-button onClick={onZoom100PercenetClicked}>100%</sp-action-button>
        <sp-action-button onClick={onZoomInClicked}>+</sp-action-button>
    </Card>
);

async function zoomFit() {
    try {
        if (!app.activeDocument)
            return;

        await core.executeAsModal(zoomToFit, {
            commandName: 'ZoomToFit'
        });

    } catch (err) {
        await app.showAlert(err.message);
    }
}

async function onZoom100PercenetClicked() {
    try {
        if (!app.activeDocument)
            return;

        await core.executeAsModal(zoomPixelPerfect, {
            commandName: 'Zoom 100%'
        });

    } catch (err) {
        await app.showAlert(err.message);
    }
}

async function onZoomInClicked() {
    try {
        if (!app.activeDocument)
            return;

        await core.executeAsModal(zoomIn, {
            commandName: 'Zoom In'
        });

    } catch (err) {
        await app.showAlert(err.message);
    }
}

async function onZoomOutClicked() {
    try {
        if (!app.activeDocument)
            return;

        await core.executeAsModal(zoomOut, {
            commandName: 'Zoom Out'
        });

    } catch (err) {
        await app.showAlert(err.message);
    }
}