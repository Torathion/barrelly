import type { ArgumentType, ArgumentValue } from 'src/types'
import Bitmap from './Bitmap'

export enum ArgumentFlags {
    Required,
    Variadic
}

export default class Argument<T extends ArgumentType> {
    defaultValue?: ArgumentValue<T>
    flags: Bitmap
    type: T

    constructor(type: T, defaultValue?: ArgumentValue<T>, variadic = false) {
        this.type = type
        this.defaultValue = defaultValue
        this.flags = new Bitmap()
        if (variadic) this.flags.set(ArgumentFlags.Variadic)
        if (!defaultValue) this.flags.set(ArgumentFlags.Required)
    }

    isVariadic(): boolean {
        return this.flags.isSet(ArgumentFlags.Variadic)
    }
}
