
export class PresetsManager<T> {

    private name: string;
    private values: T[];

    get count() {
        return this.values.length;
    }

    constructor(name: string, defaultValues: T[]) {
        this.name = name;
        this.values = defaultValues;
        this.load();
    }

    public load() {
        const storageValue = localStorage.getItem(this.name + '-presets');
        if (storageValue) {
            this.values = JSON.parse(storageValue);
        }        
    }
    public save() {
        localStorage.setItem(this.name + '-presets', JSON.stringify(this.values));
    }

    public getAll() {
        // Quick clone
        return JSON.parse(JSON.stringify(this.values)) as T[];
    }
    public get(index: number) {
        return this.values[index];
    }
    public set(index: number, value: T) {
        this.values[index] = value;
        this.save();
    }

}