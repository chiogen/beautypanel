import * as React from 'react';
import { useSelector } from 'react-redux';
import { Page } from '../../enums';
import { TState } from '../../store';
import { SaveCurrentPictureSection } from './save/save-current-picture-section';
import { SaveCopySection } from './save/save-copy-section';
import { CopyrightTool } from './save/copyright-tool';

export const SavePage = () => {

    const isActive = useSelector<TState, boolean>(state => state.page === Page.Save);

    const style: React.CSSProperties = {};
    if (!isActive)
        style.display = 'none';

    return (
        <div id="save" className="page" style={style}>
            <CopyrightTool />
            <SaveCurrentPictureSection />
            <SaveCopySection />
        </div>
    );
};
