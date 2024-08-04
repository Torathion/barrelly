export default function log(outStream: string): void {
    process.stdout.write(Buffer.from(`\n${outStream}\n`))
}
