import * as React from 'react';
import manifest from '../../package.json';

export const VersionInfo = () => (
    <div id="versionInfo">
        v{manifest.version}
    </div>
);