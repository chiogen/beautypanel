
interface OpenDialogOptions {
    title: string
    resize?: 'both' | 'horizontal' | 'vertical' | 'none'
    size?: {
        width: number
        height: number
    }
}

interface HTMLUxpDialogElement extends HTMLDialogElement {
    uxpShowModal<T = any>(options: OpenDialogOptions): Promise<T>
    // showModal<T = any>(options: OpenDialogOptions): Promise<T>
    // show<T = any>(options: OpenDialogOptions): Promise<T>
    close<T = any>(value: T): void
}
