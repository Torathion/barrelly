import type { FileHandle } from 'node:fs/promises'
import { join } from 'node:path'
import { openSafe } from '../fs'
import { cwd } from 'src/constants'

export default async function getPackageJson(): Promise<FileHandle | undefined> {
    return openSafe(join(cwd, 'package.json'), 'r+')
}
