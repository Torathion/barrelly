import { join, normalize } from 'node:path'

const cwd = process.cwd()

export default function normalizePath(path: string): string {
    return normalize(`${join(cwd, path)}\\`)
}
