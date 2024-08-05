import type { CreatedFileMetadata } from 'src/types'
import * as colors from 'yoctocolors'

export default function countTotalExports(files: CreatedFileMetadata[]): number {
    let file: CreatedFileMetadata
    let total = 0
    for (let i = files.length - 1; i >= 0; i--) {
        file = files[i]
        // Drop everything, we found the root!
        if (file.folder === colors.yellow('<root>')) return file.exports
        total += file.exports
    }
    return total
}
