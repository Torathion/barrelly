import { fdir } from 'fdir'
import safeGetFileHandle from '../fs/safeGetFileHandle'

export default async function hasTypeScript(): Promise<boolean> {
    // 1. Check for tsconfig file
    const files = await new fdir().withMaxDepth(1).withFullPaths().crawl(process.cwd()).withPromise()
    const length = files.length
    for (let i = 0; i < length; i++) if (files[i].includes('tsconfig')) return true
    // 2. Check for the typescript dependency
    const handle = await safeGetFileHandle('package.json', 'r+')
    if (!handle) return false
    for await (const line of handle.readLines()) if (line.trim().startsWith('"typescript"')) return true
    return false
}
