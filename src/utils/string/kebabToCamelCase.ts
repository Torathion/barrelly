export default function kebabToCamelCase(text: string): string {
    const parts = text.split('-')
    const first = parts.shift() ?? ''
    const length = parts.length
    let final = first
    let word: string
    for (let i = 0; i < length; i++) {
        word = parts[i]
        final = `${final}${word[0].toUpperCase()}${word.substring(1)}`
    }
    return final
}
