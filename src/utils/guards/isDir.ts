import { extname } from 'node:path'

const cache = new Map<string, boolean>()

export default function isDir(path: string): boolean {
    if (cache.has(path)) return cache.get(path)!
    const flag = path.at(-1) === '/' || !extname(path)
    cache.set(path, flag)
    return flag
}
