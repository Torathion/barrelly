import type { FileHandle } from 'node:fs/promises'

export default async function replaceFileContent(handle: FileHandle, content: string): Promise<void> {
    const buffer = Buffer.from(content)
    await handle.truncate(0)
    await handle.write(buffer, 0, buffer.byteLength, 0)
}
