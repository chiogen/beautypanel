
export class PresetsManager<T> {

    private name: string,
    private defaultValues: T[]

    constructor(name: string, defaultValues: T[]) {
        this.name = name;
        this.defaultValues = defaultValues;
    }

    public get(index: number) {
        const key = this.getStorageKey(index);
        let value = localStorage.getItem(key);
        return typeof value === 'string' ? JSON.parse(value) : this.defaultValues[index];
    }
    private getStorageKey(index: number) {
        return `preset-${this.name}-${index}`;
    }

    public set(index: number, value: T) {
        const key = this.getStorageKey(index);
        localStorage.setItem(key, JSON.stringify(value));
    }

}