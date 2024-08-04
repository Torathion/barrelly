import openFile from './openFile'

export default async function readFile(path: string): Promise<string> {
    using file = await openFile(path, 'r+')
    return (await file.handle.readFile()).toString()
}
