import { stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as colors from 'yoctocolors'
import { cwd } from 'src/constants'
import type { BarrelFileMetaData, BarrellyOptions, CreatedFileMetadata } from 'src/types/interfaces'
import { toReadableFileSize } from 'src/utils'
import replaceFileContent from 'src/utils/fs/replaceFileContent'
import safeGetFileHandle from 'src/utils/fs/safeGetFileHandle'

async function handleCreate(opts: BarrellyOptions, file: BarrelFileMetaData, isTypeScript: boolean): Promise<CreatedFileMetadata> {
    const path = join(file.path, `index.${isTypeScript ? 'ts' : 'js'}`)
    const handle = await safeGetFileHandle(path, 'r+')
    const isNew = !handle
    await (isNew ? writeFile(path, file.imports.join('\n'), 'utf8') : replaceFileContent(handle, file.imports.join('\n')))
    return {
        action: isNew ? colors.green('created') : colors.blue('updated'),
        folder: path.replace(join(cwd, opts.path), '').replace('index.ts', '').replaceAll('\\', '/').slice(1, -1) || '<root>',
        size: toReadableFileSize((await stat(path)).size)
    }
}

export default async function createFiles(files: BarrelFileMetaData[], opts: BarrellyOptions): Promise<CreatedFileMetadata[]> {
    const isTypeScript = opts.glob.includes('ts')
    // Remove root barrel file used to export everything in libraries.
    if (!opts.exportEverything) files.shift()
    if (!files.length) return []
    const length = files.length
    const promises: Promise<CreatedFileMetadata>[] = new Array(length)
    for (let i = 0; i < length; i++) promises[i] = handleCreate(opts, files[i], isTypeScript)
    return Promise.all(promises)
}
