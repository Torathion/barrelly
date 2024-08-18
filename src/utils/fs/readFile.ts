import { open } from 'fs/promises'

export default async function readFile(path: string): Promise<string> {
    return (await (await open(path, 'r+')).readFile()).toString()
}
