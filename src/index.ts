import * as colors from 'yoctocolors'
import buildFiles from './tasks/buildFiles'
import createFiles from './tasks/createFiles'
import displayCreatedFiles from './tasks/displayCreatedFiles'
import getFiles from './tasks/getFiles'
import type { BarrellyOptions } from './types/interfaces'
import { log } from './utils'

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
        log(colors.green(`Finished creating barrel files after ${Date.now() - start}ms!`))
    } else log(colors.yellow(`No barrel files were created after ${Date.now() - start}ms.`))
}
