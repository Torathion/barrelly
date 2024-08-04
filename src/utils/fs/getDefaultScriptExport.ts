export default async function getDefaultScriptExport<T>(file: string): Promise<T> {
    return ((await import(file))).default
}
