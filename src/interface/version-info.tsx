import * as React from 'react';
import { version } from '../../ccx/manifest.json';

export const VersionInfo = () => (
    <div id="versionInfo">
        v{version}
    </div>
);