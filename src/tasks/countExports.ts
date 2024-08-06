import { EmptyExportMetadata } from 'src/constants'
import type { ExportMetadata } from 'src/types'
import safeGetFileHandle from 'src/utils/fs/safeGetFileHandle'

export default async function countExports(path: string): Promise<ExportMetadata> {
    const handle = await safeGetFileHandle(path, 'r+')
    if (!handle) return EmptyExportMetadata
    let count = 0
    let hasDefault = false
    for await (const line of handle.readLines()) {
        if (line.startsWith('export') || line.startsWith('module.exports = ')) {
            count++
            if (line.includes(' default ')) hasDefault = true
        }
    }
    return { count, hasDefault, hasNormal: count > 0 }
}
