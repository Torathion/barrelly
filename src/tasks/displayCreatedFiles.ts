import { printTable } from 'console-table-printer'
import type { CreatedFileMetadata } from 'src/types/interfaces'

function getNumberPart(text: string): number {
    return +/\d+/.exec(text)!
}

export default function displayCreatedFiles(files: CreatedFileMetadata[]): void {
    printTable(files.sort((a, b) => getNumberPart(b.size) - getNumberPart(a.size)))
}
