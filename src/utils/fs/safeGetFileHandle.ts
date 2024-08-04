import type { FileHandle } from 'node:fs/promises'
import openFile from './openFile'

export default async function safeGetFileHandle(path: string, flags: string): Promise<FileHandle | undefined> {
    try {
        return (await openFile(path, flags)).handle
    } catch {
        return undefined
    }
}
