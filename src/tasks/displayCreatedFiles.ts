import { Table } from 'console-table-printer'
import type { CreatedFileMetadata } from 'src/types/interfaces'
import { sortByFileSize } from 'src/utils/sortByFileSize'

function getNumberPart(text: string): number {
    return +/\d+/.exec(text)!
}

export default function displayCreatedFiles(files: CreatedFileMetadata[]): void {
    const p = new Table({
        columns: [{ name: 'action' }, { name: 'folder', alignment: 'left' }, { name: 'size' }],
        rows: files.sort(sortByFileSize)
    })
    p.printTable()
}
