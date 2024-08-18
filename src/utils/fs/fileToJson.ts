import type { FileHandle } from 'node:fs/promises'
import stripComments from 'strip-json-comments'

export default async function fileToJson(file: FileHandle): Promise<any> {
    const obj = JSON.parse(stripComments((await file.readFile()).toString()))
    await file.close()
    return obj
}
