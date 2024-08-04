import type { FileHandle } from 'node:fs/promises'
import { join } from 'node:path'
import { safeGetFileHandle } from '../fs'
import { cwd } from 'src/constants'

export default async function getPackageJson(): Promise<FileHandle | undefined> {
    return safeGetFileHandle(join(cwd, 'package.json'), 'r+')
}
