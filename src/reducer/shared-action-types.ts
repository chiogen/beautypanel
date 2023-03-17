import { Document } from 'photoshop/dom/Document';
import { PercentValue } from 'photoshop/util/unit';
import type { ActionType } from '../store-action-types';

export interface DocumentChangedAction {
    type: ActionType.DocumentChanged
    document: Document | null
}
export interface UpdateToolDataAction {
    type: ActionType.UpdatePollData
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