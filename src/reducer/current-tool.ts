import { createReducer } from '@reduxjs/toolkit';
import { app } from 'photoshop';
import { UPDATE_TOOL_DATA } from './shared-action-types';
 
export default createReducer(app.currentTool.id, builder => {
    builder.addCase(UPDATE_TOOL_DATA, () => {
        return app.currentTool.id;
    });
});