import * as React from 'react';
import { CopyrightSection } from './save/copyright-section';
import { SaveCopySection } from './save/save-copy-section';
import { SaveCurrentPictureSection } from './save/save-current-picture-section';

export const SavePage = () => {
    return (
        <div id="save" className="page">
            <CopyrightSection />
            <SaveCurrentPictureSection />
            <SaveCopySection />
        </div>
    );
};
