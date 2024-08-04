const regex = /(?!^)[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g

function callback(match: string): string {
    return `-${match.toLowerCase()}`
}

export default function toKebabCase(text: string): string {
    return text.replaceAll(regex, callback)
}
