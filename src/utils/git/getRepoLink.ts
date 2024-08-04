import getPackageJson from './getPackageJson'

export default async function getRepoLink(): Promise<string> {
    const handle = await getPackageJson()
    if (!handle) return ''
    let hasFoundRepo: boolean | undefined, trimmedLine: string
    for await (const line of handle.readLines()) {
        trimmedLine = line.trim()
        if (trimmedLine.startsWith('"repository"')) {
            hasFoundRepo = true
            continue
        }
        if (hasFoundRepo && trimmedLine.startsWith('"url"')) return trimmedLine.substring(trimmedLine.indexOf(':') + 1).replaceAll('"', '')
    }
    await handle.close()
    return ''
}
