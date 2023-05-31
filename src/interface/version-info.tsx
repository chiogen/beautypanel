import * as React from 'react';
import manifest from '../../ccx/manifest.json';

export const VersionInfo = () => (
    <div id="versionInfo">
        v{manifest.version}
    </div>
);