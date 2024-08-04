import { getPackageMetadata } from '../git'
import { isBundledElectronApp } from '../guards'

export default async function getArgs(): Promise<string[]> {
    const argv = process.argv
    // Remove an extra position if a tool is executed via "node <tool> <options>"
    const includesNode = argv.includes((await getPackageMetadata()).name) ? 1 : 0
    const args = argv.slice((isBundledElectronApp() ? 1 : 2) + includesNode)
    for (let i = args.length - 1; i >= 0; i--) args[i] = args[i].toLowerCase()
    return args
}
