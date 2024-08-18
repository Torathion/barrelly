import type { CreatedFileMetadata } from 'src/types'

export default function countTotalExports(files: CreatedFileMetadata[]): number {
    let file: CreatedFileMetadata
    let total = 0
    for (let i = files.length - 1; i >= 0; i--) {
        file = files[i]
        total += file.exports
    }
    return total
}
