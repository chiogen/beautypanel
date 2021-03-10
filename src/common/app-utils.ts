import { ActionDescriptor, app } from "photoshop";
import { storage } from "uxp";
import { IRGBColor } from "./rgb-color";

export async function selectTool(toolId: string, options?: Object): Promise<void> {

    const descriptors = new Array<ActionDescriptor>();

    descriptors.push(_selectTool(toolId));

    if (options) {
        descriptors.push(_setToolOptions(options, toolId));
    }

    await app.batchPlay(descriptors, {});
}
export function _selectTool(type: string): ActionDescriptor {
    return {
        _obj: 'select',
        _target: {
            _ref: type
        }
    };
}

export async function setToolOptions(options: Object) {

    const [result] = await app.batchPlay([
        _setToolOptions(options)
    ], {});

    if (result.message)
        await app.showAlert(result.message);

}
export function _setToolOptions(options: Object, toolId?: string): ActionDescriptor {
    return {
        _obj: 'set',
        _target: {
            _ref: toolId ?? app.currentTool.id
        },
        to: {
            ...options
        }
    };
}

export async function setForegroundColor(r: number, g: number = r, b: number = r) {
    const [result] = await app.batchPlay([
        _setForegroundColor(r, g, b)
    ]);

    if (result.message) {
        throw new Error(result.message);
    }
}
export function _setForegroundColor(r: number, g: number = r, b: number = r) {
    return {
        _obj: "set",
        _target: [
            {
                _ref: "color",
                _property: "foregroundColor"
            }
        ],
        to: {
            _obj: 'RGBColor',
            red: r,
            blue: b,
            grain: g
        } as IRGBColor,
        source: "photoshopPicker"
    }
}

export function createFileToken(path: string) {
    return storage.localFileSystem.createSessionToken({
        isFile: true,
        isFolder: false,
        isEntry: true,
        name: path,
        nativePath: path
    });
}