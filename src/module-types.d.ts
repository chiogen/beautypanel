declare namespace JSX {

    type DefaultAttributes = {
        slot?: string
    }

    type TypedReactElement<T, P = {}> = React.DetailedHTMLProps<DefaultAttributes & React.HTMLAttributes<T> & P, T>;


    interface IntrinsicElements {

        // <sp-checkbox>
        'sp-action-button': TypedReactElement<HTMLButtonElement, {
            disabled?: boolean
            variant?: string
            quiet?: boolean
        }>

        // <sp-button>
        'sp-button': TypedReactElement<HTMLButtonElement, {
            disabled?: boolean
            variant?: string
            quiet?: boolean
        }>

        // <sp-icon>
        'sp-icon': TypedReactElement<HTMLElement>

        // <sp-checkbox>
        'sp-checkbox': TypedReactElement<HTMLInputElement>

        // <sp-textfield>
        'sp-textfield': TypedReactElement<HTMLInputElement, {
            type?: string
        }>

        // <sp-slider>
        'sp-slider': TypedReactElement<HTMLElement>

        // <sp-menu>
        'sp-menu': TypedReactElement<HTMLElement>

        // <sp-menu>
        'sp-divider': TypedReactElement<HTMLElement>

        // <sp-checkbox>
        'sp-label': TypedReactElement<HTMLSpanElement>

    }
}