import { StatefulComponent } from "../components/base/stateful-component";

export function property(proto: any, name: string) {

    if (name in proto) {
        return;
    }

    const values = new WeakMap();

    Object.defineProperty(proto, name, {
        get(this: StatefulComponent) {
            if (values.has(this)) {
                return values.get(this);
            }
            return this.state[name];
        },
        set(this: StatefulComponent, value: any) {
            const oldValue = this.state[name];
            values.set(this, value);

            if (value !== oldValue) {
                if (typeof this.enqueueStateChange === 'function') {
                    this.enqueueStateChange(name, value);
                } else {
                    setTimeout(this.setState.bind(this), 0, {
                        ...this.state,
                        [name]: value
                    });
                }
            }
        }
    });

}