import { PercentValue } from 'photoshop/util/unit';

export const UPDATE_TOOL_DATA = 'UPDATE_TOOL_DATA';

export interface UpdateToolDataAction {
    type: typeof UPDATE_TOOL_DATA
    currentToolOptions: CurrentToolOptionsDescriptor
}

export interface CurrentToolOptionsDescriptor {
    brush?: {
        hardness: PercentValue
        roundness: PercentValue
    },
    opacity: number
    useScatter: boolean
}

export const updateToolData = (currentToolOptions: CurrentToolOptionsDescriptor): UpdateToolDataAction => {
    return {
        type: UPDATE_TOOL_DATA,
        currentToolOptions
    };
};