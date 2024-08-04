export default function logError(text: string): void {
    process.stderr.write(Buffer.from(text))
}
