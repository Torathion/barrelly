import { stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as colors from 'yoctocolors'
import { cwd } from 'src/constants'
import type { BarrelFileMetaData, BarrellyOptions, CreatedFileMetadata } from 'src/types/interfaces'
import { replaceFileContent, openSafe, toReadableFileSize } from 'src/utils'

async function handleCreate(opts: BarrellyOptions, file: BarrelFileMetaData, isTypeScript: boolean): Promise<CreatedFileMetadata> {
    const path = join(file.path, `index.${isTypeScript ? 'ts' : 'js'}`)
    const handle = await openSafe(path, 'r+')
    const isNew = !handle
    await (isNew ? writeFile(path, `${file.imports.join('\n')}\n`, 'utf8') : replaceFileContent(handle, `${file.imports.join('\n')}\n`))
    return {
        action: isNew ? colors.green('created') : colors.blue('updated'),
        folder: path.replace(join(cwd, opts.path), '').replace('index.ts', '').replaceAll('\\', '/').slice(1, -1) || colors.yellow('<root>'),
        size: toReadableFileSize((await stat(path)).size),
        exports: file.exports
    }
}

export default async function createFiles(files: BarrelFileMetaData[], opts: BarrellyOptions): Promise<CreatedFileMetadata[]> {
    const isTypeScript = opts.glob.includes('ts')
    // Remove root barrel file used to export everything in libraries.
    if (!opts.exportEverything) files.shift()
    const length = files.length
    if (!length) return []
    const promises: Promise<CreatedFileMetadata>[] = new Array(length)
    for (let i = 0; i < length; i++) promises[i] = handleCreate(opts, files[i], isTypeScript)
    return Promise.all(promises)
}
