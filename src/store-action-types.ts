export enum ActionType {
    // App
    DocumentChanged = 'DOCUMENT_CHANGED',
    UpdatePollData = 'UPDATE_POLL_DATA',
    SetToolOptions = 'SET_TOOL_OPTIONS',
    SetToolOpacity = 'SET_TOOL_OPACITY',
    SetToolHardness = 'SET_TOOL_HARDNESS',
    // Page
    SetPage = 'SET_PAGE',
    // Preset Edit
    StartPresetEdit = 'START_PRESET_EDIT',
    EndPresetEdit = 'END_PRESET_EDIT'
}