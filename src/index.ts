import * as colors from 'yoctocolors'
import type { BarrellyOptions } from './types/interfaces'
import { log } from './utils'
import { buildFiles, countTotalExports, createFiles, displayCreatedFiles, getFiles } from './tasks'

export default async function run(options: BarrellyOptions): Promise<void> {
    const start = Date.now()
    // 1. Get files
    const tree = await getFiles(options)
    // Degenerated case: No files were found
    if (!tree) {
        if (!options.silent) log(colors.yellow(`No barrel files were created after ${Date.now() - start}ms.`))
        return
    }
    // 2. Build the files
    const fileMetaData = await buildFiles(options, tree)
    // 3. Create files from the parsed metadata
    const createdFiles = await createFiles(fileMetaData, options)
    // 4. Show what was created
    if (options.silent) return
    if (createdFiles.length) {
        displayCreatedFiles(createdFiles)
        const totalExports = countTotalExports(createdFiles)
        log(colors.green(`Finished creating barrel files for ${totalExports} exports after ${Date.now() - start}ms!`))
    } else log(colors.yellow(`No barrel files were created after ${Date.now() - start}ms.`))
}
