import { Page } from "../enums";
import { ActionType, store } from "../store";
import { html } from 'htm/react'
import i18next from "i18next";

// ToDo: Make Tabbar a component

let activePage: Page = Page.Tools;

export const tabbar = () => html`
    <div id="tabbar">
        <div id="tabbar-tools" className="tab" page="tools" onClick="${onTabClick}">
            ${i18next.t('tabbar.tools')}
        </div>
        <div id="tabbar-sharpen" className="tab" page="sharpen" onClick="${onTabClick}">
            ${i18next.t('tabbar.sharpen')}
        </div>
        <div id="tabbar-effects" className="tab" page="effects" onClick="${onTabClick}">
            ${i18next.t('tabbar.effects')}
        </div>
        <div id="tabbar-settings" className="tab" page="settings" onClick="${onTabClick}">
            <!-- <img width="12" height="12" src="icons/ic_settings_white_48dp_1x.png" /> -->
            ${i18next.t('tabbar.settings')}
        </div>
    </div>
`;

function onTabClick(event: MouseEvent) {
    const tab = event.currentTarget as HTMLElement;
    activePage = tab.getAttribute('page') as Page;
    updateTabs();
    updatePages();

    store.dispatch({
        type: ActionType.SetPage,
        page: tab.getAttribute('page') as Page
    });
}

export function getTabs() {
    return document.body.querySelectorAll<HTMLElement>('#tabbar .tab');
}
export function getPages() {
    return document.body.querySelectorAll<HTMLElement>('.page');
}
export function updateTabs() {
    const tabs = getTabs();

    for (const tab of tabs) {
        if (tab.getAttribute('page') === activePage) {
            tab.classList.remove('selected');
        } else {
            tab.classList.add('selected');
        }
    }
}
export function updatePages() {
    const pages = getPages();

    for (const page of pages) {
        if (page.id === activePage) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    }
}