const CompareOptions: any = { sensitivity: 'base' }

export default function lexicCompare(a: string, b: string): number {
    return a.localeCompare(b, 'en', CompareOptions)
}
