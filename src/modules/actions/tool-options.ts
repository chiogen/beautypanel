import { core } from 'photoshop';
import { percent } from '../../common/units';
import { CurrentToolOptionsDescriptor } from '../../reducer/shared-action-types';
import { setToolOptions } from '../application/set-tool-options';


let _promise: Promise<void> | undefined;

export const toolOptionsUpdateComplete = () => (_promise ?? Promise.resolve());

export function setToolOptionsFromState(descriptor: CurrentToolOptionsDescriptor, opacity: number, hardness: number) {

    _promise = Promise.resolve(_promise).finally(() => core.executeAsModal(() => {

        if (descriptor.brush) {
            descriptor.brush.hardness = percent(hardness);
        }

        descriptor.opacity = opacity;
        descriptor.useScatter = false;

        return setToolOptions(descriptor);

    }, {
        commandName: 'Update Tool Options'
    }));
}