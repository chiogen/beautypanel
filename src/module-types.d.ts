declare namespace JSX {
    interface IntrinsicElements {

        // <sp-checkbox>
        'sp-action-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement & {
            active: boolean
        }>, HTMLButtonElement>

        // <sp-checkbox>
        'sp-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>

        // <preset-edit-dialog>
        'preset-edit-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>

        // <preset-edit-dialog-slider>
        'preset-edit-dialog-slider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>

        // <sp-slider>
        'sp-slider': React.DetailedHTMLProps<any, HTMLElement>

    }
}