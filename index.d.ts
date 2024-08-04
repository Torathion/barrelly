export interface CLISchemaObject {
    [x: string]: (boolean | string)[] | boolean | string | undefined
    /**
     *  Hides all the output from the tool.
     *
     *  @defaultValue `false`
     */
    silent?: boolean
}

export interface BarrellyOptions extends CLISchemaObject {
    /**
     *  Extension aliases handled by the bundler.
     *
     *  @defaultValue `[]`
     */
    aliases: string[]
    /**
     *  Flag deciding whether the tool should count all the exports or should only assume the default export based on the file name.
     *
     *  @defaultValue `true`
     */
    countExports: boolean
    /**
     *  Flag deciding whether the tool should export everything or just have the barrel files internally. This is necessary for libraries and subfolders.
     *
     *  @defaultValue `false`
     */
    exportEverything: boolean
    /**
     *  Glob describing the extension of every file to walk through.
     *
     *  @defaultValue `.ts`
     */
    glob: string
    /**
     *  The target folder as the root folder for the barrel file tree.
     *
     *  @defaultValue `./src`
     */
    path: string
    /**
     *  Flag deciding whether the barrel file should use a semicolon (;) at the end of every line or not.
     */
    semi: boolean
}

/**
 *  Starts the CLI-Tool `barrelly`. This tool will go through the entire file tree of the given path in the options and create a barrel file
 *  for each folder
 *
 * @param options - the options for this tool.
 */
export default function run(options: BarrellyOptions): Promise<void>
