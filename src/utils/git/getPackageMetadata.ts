import type { PackageJson } from 'src/types'
import getPackageJson from './getPackageJson'
import { fileToJson } from '../fs'

export default async function getPackageMetadata(): Promise<PackageJson> {
    const handle = await getPackageJson()
    if (!handle) return { name: '', version: '' }
    return fileToJson(handle)
}
