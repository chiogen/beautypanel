declare namespace JSX {

    type DefaultAttributes = {
        slot?: string
    }

    interface IntrinsicElements {

        // <sp-checkbox>
        'sp-action-button': React.DetailedHTMLProps<DefaultAttributes & React.HTMLAttributes<HTMLButtonElement> & {
            quiet?: boolean
            disabled?: boolean
        }, HTMLButtonElement>

        // <sp-button>
        'sp-button': React.DetailedHTMLProps<DefaultAttributes & React.HTMLAttributes<HTMLButtonElement> &  {
            disabled?: boolean
            variant?: string
            quiet?: boolean
        }, HTMLButtonElement>

        // <sp-icon>
        'sp-icon': React.DetailedHTMLProps<DefaultAttributes & React.HTMLAttributes<HTMLElement> & {
            size?: string
        }, HTMLElement>

        // <sp-checkbox>
        'sp-checkbox': React.DetailedHTMLProps<DefaultAttributes & React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>

        // <preset-edit-dialog>
        'preset-edit-dialog': React.DetailedHTMLProps<DefaultAttributes & React.HTMLAttributes<HTMLElement>, HTMLElement>

        // <preset-edit-dialog-slider>
        'preset-edit-dialog-slider': React.DetailedHTMLProps<DefaultAttributes & React.HTMLAttributes<HTMLElement>, HTMLElement>

        // <sp-slider>
        'sp-slider': React.DetailedHTMLProps<any, HTMLElement>

    }
}