import i18next from "i18next";
import { ActionDescriptor, app, Document, Layer } from "photoshop";
import { DialogOptions } from "../enums/dialog-options";
import { showConfirmDialog } from "./dialog";
import { percent, pixels } from "./units";

export namespace DocumentUtils {

    export async function getBitsPerChannel(document: Document): Promise<number> {
        const descriptor: ActionDescriptor = {
            _obj: "get",
            _target: [
                {
                    _property: "depth"
                },
                {
                    _ref: "document",
                    _id: document._id
                }
            ]
        };

        const [result] = await app.batchPlay([descriptor], {});
        return (result as any).depth as number;
    }

    export async function checkBitsPerChannel(document: Document) {

        const bitsPerChannel = await getBitsPerChannel(document);
        if (bitsPerChannel >= 16) {
            return;
        }

        const message = i18next.t('requestBitsPerChannelConvert');

        const convert = await showConfirmDialog(message);

        if (convert) {

            const descriptor: ActionDescriptor = {
                _obj: 'convertMode',
                _target: {
                    _ref: 'document',
                    _id: document._id
                },
                depth: 16,
                merge: false
            };

            await app.batchPlay([descriptor], {});

        }

    }

    export async function selectNoLayers() {
        await app.batchPlay([
            {
                _obj: "selectNoLayers",
                _target: [
                    {
                        _ref: "layer",
                        _enum: "ordinal",
                        _value: "targetEnum"
                    }
                ]
            }
        ], {})
    }

    export async function createNewLayer(name: string) {

        if (!app.activeDocument) {
            throw new Error('No active document.');
        }

        const [result] = await app.batchPlay([
            _createNewLayer(name)
        ]);

        if (result.message) {
            throw new Error(result.message);
        }

        return app.activeDocument!.activeLayers[0];
    }
    export function _createNewLayer(name: string): ActionDescriptor {
        return {
            _obj: 'make',
            _target: [
                {
                    _ref: "layer"
                }
            ],
            using: {
                _obj: "layer",
                name
            },
            // layerID: 6
        };
    }

    export function _selectLayers(layers: Layer[], makeVisible: boolean = false): ActionDescriptor {

        const layerIds = layers.map(x => x._id);
        const firstLayer = layers[0];

        const descriptor: ActionDescriptor = {
            _obj: 'select',
            _target: {
                _ref: 'layer',
                _id: firstLayer._id
            },
            makeVisible: makeVisible,
            layerID: layerIds
        };

        return descriptor;
    }
    export async function selectLayers(layers: Layer[], makeVisible: boolean = false): Promise<void> {

        if (layers.length === 0)
            return;

        const descriptor = _selectLayers(layers, makeVisible);
        await app.batchPlay([
            descriptor
        ], {});
    }

    export async function mergeLayers(document: Document, layers: Layer[]): Promise<Layer> {

        const duplicates = await Promise.all(layers.map(async layer => layer.duplicate()));
                
        const results = await app.batchPlay([
            _selectLayers(duplicates),
            {
                _obj: "mergeLayersNew"
            }
        ]);

        for (const result of results) {
            if (result.message) {
                throw new Error(result.message);
            }
        }

        return document.activeLayers[0];
    }

    export function _deleteLayer(layer: Layer): ActionDescriptor {
        return {
            _obj: "delete",
            _target: [
                {
                    _ref: "layer",
                    _id: layer._id
                }
            ],
            layerID: [
                layer._id
            ]
        }
    }

    export async function resizeImage(width: number): Promise<void> {
        const descriptor: ActionDescriptor = {
            _obj: "imageSize",
            width: pixels(width),
            scaleStyles: true,
            constrainProportions: true,
            interfaceIconFrameDimmed: {
                _enum: "interpolationType",
                _value: "automaticInterpolation"
            }
        };

        const [result] = await app.batchPlay([descriptor]);

        if (result.message) {
            throw new Error(result.message);
        }
    }

    export async function unsharpMask(amount?: number, radius?: number, threshold?: number, dialogOptions: DialogOptions = DialogOptions.DontDisplay) {
        const descriptor: ActionDescriptor = {
            _obj: "unsharpMask",
            _options: {
                dialogOptions
            }
        };

        if (typeof amount === 'number') {
            descriptor.amount = percent(amount);
        }

        if (typeof radius === 'number') {
            descriptor.radius = pixels(radius);
        }

        if (typeof threshold === 'number') {
            descriptor.threshold = threshold;
        }

        const [result] = await app.batchPlay([descriptor]);
        if (result.message) {
            throw new Error(result.message);
        }

        return result;
    }


}