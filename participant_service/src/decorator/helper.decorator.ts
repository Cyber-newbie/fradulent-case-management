export function bound(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = context.name;

    if (context.private) throw new Error(`'bound' cannot decorate private properties like ${methodName as string}.`);

    context.addInitializer(function (this: any) {
        this[methodName] = this[methodName].bind(this);
    });
}

export function Builder<T extends { new(...args: any[]): {} }>(constructor: T) {
    console.log(`Decorator called for class: ${constructor.name}`);

    return class extends constructor {
        public static Builder() {
            console.log(`Builder method called for class: ${this.name}`);
            return new this();
        }

        constructor(...args: any[]) {
            super(...args);
            console.log(`Constructor called for instance of: ${this.constructor.name}`);
                                    
            const privateFields = Object.getOwnPropertyNames(this);
            console.log(`Private fields: ${privateFields.join(', ')}`);

            privateFields.forEach((field) => {
                const setterName = `set${field.charAt(0).toUpperCase() + field.slice(1)}`;
                console.log(`Adding setter method: ${setterName}`);
                (this as any)[setterName] = (value: any) => {
                    console.log(`Setting value for field: ${field}`);
                    (this as any)[field] = value;
                    return this;
                };
            }, this);
        }
    };
}

export function Getter<T extends { new(...args: any[]): {} }>(constructor: T) {
    console.log(`Decorator called for class: ${constructor.name}`);

    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            console.log(`Constructor called for instance of: ${this.constructor.name}`);

            const privateFields = Object.getOwnPropertyNames(this);
            console.log(`Private fields: ${privateFields.join(', ')}`);

            privateFields.forEach((field) => {
                const getterName = `get${field.charAt(0).toUpperCase() + field.slice(1)}`;
                console.log(`Adding getter method: ${getterName}`);
                (this as any)[getterName] = () => {
                    console.log(`Setting value for field: ${field}`);
                    return (this as any)[field]
                };
            });
        }
    };
}

export function Setter<T extends { new(...args: any[]): {} }>(constructor: T) {
    console.log(`Decorator called for class: ${constructor.name}`);

    return class extends constructor {

        constructor(...args: any[]) {
            super(...args);
            console.log(`Constructor called for instance of: ${this.constructor.name}`);

            const privateFields = Object.getOwnPropertyNames(this);
            console.log(`Private fields: ${privateFields.join(', ')}`);

            privateFields.forEach((field) => {
                const setterName = `set${field.charAt(0).toUpperCase() + field.slice(1)}`;
                console.log(`Adding setter method: ${setterName}`);
                (this as any)[setterName] = (value: any) => {
                    console.log(`Setting value for field: ${field}`);
                    (this as any)[field] = value;
                    return this;
                };
            }, this);
        }
    };
}

