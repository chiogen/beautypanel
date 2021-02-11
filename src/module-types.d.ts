declare namespace JSX {
    interface IntrinsicElements {
        'sp-action-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement & {
            active: boolean
        }>, HTMLButtonElement>;
        'sp-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    }
}