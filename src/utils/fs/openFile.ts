import { type FileHandle, open } from 'node:fs/promises'
import type { Disposable } from 'src/types/interfaces'

export default async function openFile(path: string, flags: string): Promise<Disposable<FileHandle>> {
    const fileHandle = await open(path, flags)
    return {
        async [Symbol.dispose](): Promise<void> {
            await fileHandle.close()
        },
        handle: fileHandle
    }
}
