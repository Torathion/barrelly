import safeGetFileHandle from 'src/utils/fs/safeGetFileHandle'

export default async function countExports(path: string): Promise<number> {
    const handle = await safeGetFileHandle(path, 'r+')
    if (!handle) return 0
    let exportCount = 0
    for await (const line of handle.readLines()) if (line.startsWith('export') || line.startsWith('module.exports = ')) exportCount++
    return exportCount
}
