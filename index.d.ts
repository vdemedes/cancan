declare namespace CanCan {
    export interface Option {
        instanceOf?: <T, U>(instance: T, model: U) => boolean;
        createError?: () => any;
    }
}

declare class CanCan {
    public constructor(options?: CanCan.Option);

    public allow<T, U>(model: T,
                       actions: string | string[],
                       targets: U | U[] | string | string[],
                       condition?: any | (<T, U>(performer: T, target: U) => boolean)): void;

    public can<T, U>(performer: T, action: string, target: U, payload?: any): boolean;

    public cannot<T, U>(performer: T, action: string, target: U): boolean;

    public authorize<T, U>(performer: T, action: string, target: U): void;
}

export = CanCan;
