import type { ArgumentType } from './types'

export interface FileSizeable {
    size: string
}

export interface CLISchemaObject {
    [x: string]: (boolean | string)[] | boolean | string | undefined
    silent?: boolean
}

export interface BarrellyOptions extends CLISchemaObject {
    aliases: string[]
    countExports: boolean
    exportEverything: boolean
    glob: string
    path: string
    semi: boolean
}

export interface ExportsCounter {
    exports: number
}

export interface FileBuildMetadata extends ExportsCounter {
    lines: Set<string>
}

export interface ExportMetadata {
    count: number
    hasDefault: boolean
    hasNormal: boolean
}

export interface FileMetaData {
    dir?: boolean
    exportMeta: ExportMetadata
    path: string
}

export interface BarrelFileMetaData extends ExportsCounter {
    imports: string[]
    path: string
}

export interface Disposable<T> {
    [Symbol.dispose]: () => Promise<void> | void
    handle: T
}

export interface CreatedFileMetadata extends FileSizeable, ExportsCounter {
    action: string
    folder: string
}

export interface ArgMetadata {
    default?: boolean[] | string[] | boolean | string
    multiple: boolean
    short?: string
    type: ArgumentType
}

export interface ArgToken {
    index: number
    inlineValue?: boolean
    kind: 'option-terminator' | 'option' | 'positional'
    name: string
    rawName: string
    value?: string
}

export interface ParsedArgs<S extends object> {
    positionals: unknown[]
    tokens: ArgToken[]
    values: S
}

export interface PackageJsonAddress {
    email?: string
    url?: string
}

export interface PackageJsonAuthor extends PackageJsonAddress {
    name: string
}

export interface PackageJsonDirectories {
    bin?: string
    doc?: string
    example?: string
    lib?: string
    man?: string
    test?: string
}

export interface PackageJsonRepo {
    directory?: string
    type?: 'git'
    url?: string
}

export interface PackageJson {
    author?: PackageJsonAuthor | string
    bin?: Record<string, string>
    browser?: string
    bugs?: PackageJsonAddress
    bundledDependencies?: string[]
    config?: Record<string, string>
    contributors?: PackageJsonAuthor[] | string[]
    cpu?: string[]
    dependencies?: Record<string, string>
    description?: string
    devDependencies?: Record<string, string>
    directories?: PackageJsonDirectories
    engines?: Record<string, string>
    files?: string[]
    homepage?: string
    keywords?: string[] | string
    license?: string
    main?: string
    man?: string
    name: string
    optionalDependencies?: Record<string, string>
    os?: string[]
    peerDependencies?: Record<string, string>
    repository?: PackageJsonRepo
    scripts?: Record<string, string>
    type?: 'commonjs' | 'module'
    types?: string
    version: string
}

export interface ElectronProcess extends NodeJS.Process {
    defaultApp?: boolean
    versions: NodeJS.ProcessVersions & {
        electron: string
    }
}
