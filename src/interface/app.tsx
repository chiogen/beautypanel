import * as React from 'react';
import { Pages } from './pages';
import { Tabbar } from './tabbar';
import { VersionInfo } from './version-info';

export function App() {
    return <>
        <Tabbar />
        <Pages />
        <VersionInfo />
    </>;
}