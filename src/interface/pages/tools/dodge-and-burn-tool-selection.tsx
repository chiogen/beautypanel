import * as React from 'react';
import { useSelector } from 'react-redux';
import { TState } from '../../../store';
import { core } from 'photoshop';
import { selectToolForDodgeAndBurn } from '../../../modules/actions/dodge-and-burn';
import { handleException } from '../../../common/errors/handle-error';

export const DodgeAndBurnToolSelection = () => {
    const currentTool = useSelector<TState, string>(state => state.currentTool);

    return (
        <div className="flex stretch">
            <sp-action-button data-active={currentTool === 'paintbrushTool'} onClick={onBrushButtonClicked}>Brush</sp-action-button>
            <sp-action-button data-active={currentTool === 'cloneStampTool'} onClick={onStampButtonClicked}>Stamp</sp-action-button>
        </div>
    );
};

async function onBrushButtonClicked() {
    try {

        await core.executeAsModal(selectToolForDodgeAndBurn('paintbrushTool'), {
            commandName: 'Select Dodge And Burn Brush'
        });

    } catch (err) {
        await handleException(err);
    }

}
async function onStampButtonClicked() {
    try {

        await core.executeAsModal(selectToolForDodgeAndBurn('cloneStampTool'), {
            commandName: 'Select Dodge And Burn CloneStamp'
        });

    } catch (err) {
        await handleException(err);
    }
}