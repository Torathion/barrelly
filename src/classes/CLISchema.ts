import { fdir } from 'fdir'
import { join } from 'node:path'
import { parse } from 'yaml'
import { load } from 'js-toml'
import { cwd } from 'src/constants'
import type { ArgToken, CLISchemaObject, ParsedArgs } from 'src/types'
import { fileToJson, getDefaultScriptExport, kebabToCamelCase, openFile, readFile, toKebabCase } from 'src/utils'
import extension from 'src/utils/path/extension'

function normalizeKeys<T extends CLISchemaObject>(values: T): T {
    const keys = Object.keys(values)
    let key: string
    for (let i = keys.length - 1; i >= 0; i--) {
        key = keys[i]
        // Remove negated
        if (key.startsWith('no-')) delete values[key]
        else if (key.includes('-')) {
            ;(values as any)[kebabToCamelCase(key)] = values[key]
            delete values[key]
        }
    }
    return values
}

export default class CLISchema<T extends CLISchemaObject> {
    protected fileName?: string
    protected schema: T
    protected scriptTarget: string

    constructor(defaultValues: T, scriptTarget: string) {
        this.schema = defaultValues
        this.scriptTarget = scriptTarget
        // Extra options
        this.schema.silent = false
    }

    configFile(name: string): this {
        this.fileName = name
        return this
    }

    protected async getContentFromConfig(): Promise<T> {
        const name = this.fileName
        if (!name) throw new Error('The CLI does not specify a config file.')
        const configFiles = await new fdir()
            .withFullPaths()
            .filter(path => path.includes(name))
            .crawl(cwd)
            .withPromise()
        if (!configFiles.length) return {} as T
        const ext = extension(configFiles[0])
        const fileName = join(cwd, `${name}.${ext}`)
        switch (ext) {
            case 'js':
                return getDefaultScriptExport(fileName)
            case 'json':
                return fileToJson((await openFile(fileName, 'r+')).handle)
            case 'yml':
            case 'yaml':
                return parse(await readFile(fileName))
            case 'toml':
                return load(await readFile(fileName)) as unknown as T
            default:
                throw new Error(`Could not read config file. Unsupported file format ${ext}.`)
        }
    }

    handleArgs({ positionals, tokens, values }: ParsedArgs<T>): T {
        normalizeKeys(values)
        if (!tokens.length) return values
        const options = tokens.filter(token => token.kind === 'option')
        const len = options.length
        let positiveName: string, tokenName: string, token: ArgToken
        // Handle negated options
        const newValues: Record<string, unknown> = Object.assign({}, values)
        for (let i = 0; i < len; i++) {
            token = options[i]
            tokenName = token.name
            if (Array.isArray(newValues[tokenName])) newValues[tokenName] = (newValues[tokenName] as string[])[0].split(' ')
            else if (tokenName.startsWith('no-')) {
                positiveName = tokenName.substring(3)
                newValues[positiveName] = values[tokenName]
                delete newValues[tokenName]
            } else newValues[kebabToCamelCase(tokenName)] = token.value ?? true
        }
        const posLen = positionals.length
        if (posLen) {
            newValues[this.scriptTarget] = posLen === 1 ? positionals[0] : positionals
        }
        return newValues as T
    }
}
