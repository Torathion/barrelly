import { printTable } from 'console-table-printer'
import type { CreatedFileMetadata } from 'src/types/interfaces'
import { sortByFileSize } from 'src/utils/sortByFileSize'

function getNumberPart(text: string): number {
    return +/\d+/.exec(text)!
}

export default function displayCreatedFiles(files: CreatedFileMetadata[]): void {
    printTable(files.sort(sortByFileSize))
}
