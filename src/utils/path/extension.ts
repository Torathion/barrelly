const regex = /(?:\.([^.]+))?$/
export default function extension(path: string): string {
    if (path.at(-1) !== '/') return regex.exec(path)?.[1] ?? ''
    return ''
}
