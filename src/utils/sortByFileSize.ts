import { FileSizeUnits } from 'src/constants'
import type { FileSizeable } from 'src/types'

const regex = /^(\d*\.?\d+)(\D+)$/

export function sortByFileSize(a: FileSizeable, b: FileSizeable): number {
    const aMatches = regex.exec(a.size)
    const bMatches = regex.exec(b.size)
    if (!aMatches || !bMatches) return -1
    return +bMatches[1] * 1000 ** FileSizeUnits.indexOf(bMatches[2]) - +aMatches[1] * 1000 ** FileSizeUnits.indexOf(aMatches[2])
}
