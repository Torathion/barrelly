import type { ExportMetadata } from './types'

export const cwd = process.cwd()
export const FileSizeUnits = ['b', 'kb', 'mb', 'gb', 'tb', 'pb']
export const EmptyExportMetadata: ExportMetadata = { count: 0, hasDefault: false, hasNormal: false }
