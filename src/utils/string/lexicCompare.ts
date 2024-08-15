export default function lexicCompare(a: string, b: string): number {
    return a.localeCompare(b, 'en')
}
