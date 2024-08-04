import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'

export default async function ensureFile(path: string, content = ''): Promise<void> {
    if (!existsSync(path)) await writeFile(path, content, 'utf8')
}
