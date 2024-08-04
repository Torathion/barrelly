import type { ArgMetadata, ArgumentType, ArgumentValue } from 'src/types'
import Argument from './Argument'
import Bitmap from './Bitmap'

export enum OptionFlags {
    Switch,
    Verbose
}

function handleArgDefault<T extends ArgumentType>(type: T, variadic: boolean): ArgumentValue<T> {
    if (variadic) return [] as any
    if (type === 'string') return '' as ArgumentValue<T>
    if (type === 'boolean') return true as ArgumentValue<T>
    return '' as ArgumentValue<T>
}

export default class Option<T extends ArgumentType> {
    argument: Argument<T>
    description: string
    flags: Bitmap
    key: string
    short?: string
    valueIndicator?: string

    constructor(name: string, type: T, description: string, valueIndicator?: string, argument?: Argument<T>, variadic = false) {
        this.description = description
        this.flags = new Bitmap()
        this.key = name
        if (!name.startsWith('no-')) this.short = name[0]
        this.argument = argument ?? new Argument(type, handleArgDefault(type, variadic))
        if (type === 'boolean') this.flags.set(OptionFlags.Switch)
        else if (valueIndicator) this.valueIndicator = valueIndicator
    }

    argMetadata(): Record<string, ArgMetadata> {
        const arg = this.argument
        const key = this.key
        const options: Record<string, ArgMetadata> = {
            [key]: {
                default: arg.defaultValue,
                multiple: arg.isVariadic(),
                type: arg.type
            }
        }
        if (this.short) options[key].short = this.short
        return options
    }

    helpName(): string {
        const valueIndicatorString = this.valueIndicator ? `<${this.valueIndicator}>` : ''
        const shortString = this.short ? `-${this.short}, ` : ''
        return `${shortString}--${this.key} ${valueIndicatorString}`
    }

    helpText(nameLengthLimit: number): string {
        const helpName = this.helpName()
        return `${helpName}${' '.repeat(nameLengthLimit - helpName.length)}\t\t${this.description}`
    }

    isSwitch(): boolean {
        return this.flags.isSet(OptionFlags.Switch)
    }

    negate(): this {
        if (!this.isSwitch()) return this
        const arg = this.argument as Argument<'boolean'>
        arg.defaultValue = !arg.defaultValue
        return this
    }

    noShort(): this {
        this.short = undefined
        return this
    }
}
