import { FileSizeUnits } from 'src/constants'

export default function toReadableFileSize(size: number): string {
    const i = Math.floor(Math.log(size) * 0.14426950408889633)
    return `${Math.round((size / 1024 ** i) * 100) * 0.01}${FileSizeUnits[i]}`
}
