/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace JSX {

    type DefaultAttributes = {
        slot?: string
    };

    type TypedReactElement<T, P = {}> = React.DetailedHTMLProps<DefaultAttributes & React.HTMLAttributes<T> & Partial<P>, T>;


    interface IntrinsicElements {
        'sp-action-button': TypedReactElement<import('@spectrum-web-components/action-button').ActionButton>
        'sp-button': TypedReactElement<import('@spectrum-web-components/button').Button>
        'sp-icon': TypedReactElement<import('@spectrum-web-components/icon').Icon>
        'sp-checkbox': TypedReactElement<import('@spectrum-web-components/checkbox').Checkbox>
        'sp-textfield': TypedReactElement<import('@spectrum-web-components/textfield').Textfield, {
            type: string,
            value: string
        }>
        'sp-textarea': TypedReactElement<import('@spectrum-web-components/textfield').Textfield, {
            type: string,
            value: string
        }>
        'sp-slider': TypedReactElement<import('@spectrum-web-components/slider').Slider>
        'sp-menu': TypedReactElement<import('@spectrum-web-components/menu').Menu>
        'sp-menu-item': TypedReactElement<import('@spectrum-web-components/menu').MenuItem>
        'sp-divider': TypedReactElement<import('@spectrum-web-components/divider').Divider>
        'sp-label': TypedReactElement<HTMLLabelElement>
    }
}