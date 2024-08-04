import { EventEmitter } from 'node:events'
import { parseArgs } from 'node:util'
import * as colors from 'yoctocolors'
import Bitmap from './Bitmap'
import Argument from './Argument'
import Option from './Option'
import type { ArgMetadata, ArgumentType, ArgumentValue, CLISchemaObject, ParsedArgs } from 'src/types'
import { getRepoVersion, log, logError, toKebabCase } from 'src/utils'
import type CLISchema from './CLISchema'
import getPackageMetadata from 'src/utils/git/getPackageMetadata'
import getArgs from 'src/utils/process/getArgs'

export enum CommandFlags {
    Target,
    Options
}

export type CommandAction<S extends CLISchemaObject> = (parsedArgs?: S) => Promise<void>

// TODO: Add option to add a config file schema with path

export default class Command<S extends CLISchemaObject, T extends ArgumentType = 'string'> extends EventEmitter {
    argument?: Argument<T>
    commandAction?: CommandAction<S>
    description: string
    flags: Bitmap
    name: string
    targetName?: string
    private readonly options: Record<string, Option<ArgumentType>>
    private readonly shortHands: Set<string>
    private readonly schema: CLISchema<S>

    constructor(name: string, description: string, schema: CLISchema<S>) {
        super()
        this.name = name
        this.description = description
        this.flags = new Bitmap()
        this.options = {
            help: new Option('help', 'boolean', 'Shows the help page of the command.'),
            version: new Option('version', 'boolean', 'Shows the current version of the command.'),
            silent: new Option('silent', 'boolean', 'Hides all output of the tool.').noShort().negate()
        }
        this.shortHands = new Set(['h', 'v'])
        this.schema = schema
    }

    action(callback: CommandAction<S>): this {
        this.commandAction = callback
        return this
    }

    hasOptions(): boolean {
        return this.flags.isSet(CommandFlags.Options)
    }

    hasTarget(): boolean {
        return this.flags.isSet(CommandFlags.Target)
    }

    option<T extends ArgumentType>(
        name: string,
        type: T,
        defaultValue?: ArgumentValue<T>,
        description = '',
        valueIndicator = '',
        variadic = false,
        omitShort = false
    ): this {
        const kebabName = toKebabCase(name)
        this.integrateOption(
            new Option<T>(kebabName, type, description, valueIndicator, new Argument(type, defaultValue, variadic)),
            kebabName,
            omitShort
        )
        if (type === 'boolean') {
            // Automatically add negated option for switch
            const negatedName = `no-${kebabName}`
            this.integrateOption(
                new Option<'boolean'>(
                    negatedName,
                    type,
                    `Negated option of ${kebabName}.`,
                    '',
                    new Argument<'boolean'>(type, !defaultValue, variadic)
                ),
                negatedName
            )
        }
        return this
    }

    private integrateOption<T extends ArgumentType>(option: Option<T>, name: string, omitShort = false): void {
        if (omitShort) option.noShort()
        if (option.short) this.shortHands.add(option.short)
        this.options[name] = option
        this.flags.set(CommandFlags.Options)
    }

    async run(): Promise<void> {
        const args = await getArgs()
        const action = this.commandAction
        if (args.includes('-v') || args.includes('--version')) log(await this.versionText())
        else if (args.includes('-h') || args.includes('--help')) log(await this.helpText())
        else if (action) await action((this.hasOptions() && this.parseArgs(args)) as any)
        else logError(`Command ${this.name} has no action.`)
    }

    target(type: T, defaultValue: ArgumentValue<T>, optionName: string, description = '', variadic = false): this {
        const arg = new Argument<T>(type, defaultValue, variadic)
        this.argument = new Argument<T>(type, defaultValue, variadic)
        this.targetName = optionName
        this.integrateOption(new Option<T>(optionName, type, description, optionName, arg), optionName)
        this.flags.set(CommandFlags.Target)
        return this
    }

    private async helpText(): Promise<string> {
        const opts = this.options
        const keys = Object.keys(opts).sort()
        const length = keys.length
        // 1. Get the longest name and align it to there.
        let max = 0
        let i: number
        for (i = 0; i < length; i++) max = Math.max(opts[keys[i]].helpName().length, max)
        const metadata = await getPackageMetadata()
        const header = await this.versionText(metadata.version)
        // 2. Build the text, iterate through each option and add a helpful note at the end of it.
        let finalText = `${header}\n\n${this.description}\n\n${colors.bold('Options:')}\n`
        for (i = 0; i < length; i++) finalText = `${finalText}\n${opts[keys[i]].helpText(max)}`
        if (!metadata.repository?.url) return finalText
        const helper = colors.yellow(`For more information, visit:${metadata.repository.url}`)
        return `${finalText}\n\n${helper}`
    }

    private async versionText(version?: string): Promise<string> {
        return `${colors.bold(this.name)}\t ${colors.bold('Version:')} ${colors.green(version ?? (await getRepoVersion()))}`
    }

    private parseArgs(args: string[]): S {
        const opts = this.options
        const keys = Object.keys(opts).slice(2)
        const length = keys.length
        const optsArr: Record<string, ArgMetadata>[] = new Array(length)
        for (let i = 0; i < length; i++) optsArr[i] = opts[keys[i]].argMetadata()
        return this.schema.handleArgs(
            parseArgs({ options: Object.assign(...optsArr), tokens: true, allowPositionals: true, args }) as unknown as ParsedArgs<S>
        )
    }
}
