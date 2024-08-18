import { basename, extname } from 'node:path'
import type { TreeNode } from 'src/structures/Tree'
import type Tree from 'src/structures/Tree'
import type { BarrelFileMetaData, BarrellyOptions, FileBuildMetadata, FileMetaData } from 'src/types/interfaces'
import * as colors from 'yoctocolors'
import countExports from './countExports'
import { lexicCompare, log } from 'src/utils'

const files = new Map<string, FileBuildMetadata>()

function getMetaData(currentNode: TreeNode<FileMetaData>): FileBuildMetadata {
    const parentPath = currentNode.parent?.value.path ?? currentNode.value.path
    if (files.has(parentPath)) return files.get(parentPath)!
    const metadata = { lines: [], exports: 0 }
    files.set(parentPath, metadata)
    return metadata
}

function shouldEscapeExtension(value: FileMetaData, ext: string, aliases: string[]): boolean {
    return !value.dir && (ext === '.ts' || (!!aliases.length && aliases.includes(ext)))
}

function getExportLine(value: FileMetaData, opts: BarrellyOptions): string {
    const path = value.path
    const ext = extname(path)
    const exportName = basename(path)
    const exportMeta = value.exportMeta
    const relPath = `from './${shouldEscapeExtension(value, ext, opts.aliases) ? exportName.split('.')[0] : exportName}'`
    let exportString = ''
    if (exportMeta.hasDefault) {
        exportString = `export { default as ${exportName.substring(0, exportName.indexOf('.'))} } ${relPath}${opts.semi ? ';' : ''}`
    }
    if (value.dir || (exportMeta.count > 1 && exportMeta.hasNormal) || (exportMeta.count === 1 && !exportMeta.hasDefault)) {
        exportString = `${exportString}${exportString.length ? '\n' : ''}export * ${relPath}`
    }
    return exportString
}

function handleMetadata(node: TreeNode<FileMetaData>, opts: BarrellyOptions): void {
    const metadata = getMetaData(node)
    const value = node.value
    const line = getExportLine(value, opts)
    if (metadata.lines.includes(line)) log(colors.yellow(`Duplicate export line "${colors.yellowBright(line)}" found. Can not export everything.`))
    else {
        metadata.lines.push(getExportLine(value, opts))
        metadata.exports += value.exportMeta.count
    }
}

export default async function buildFiles(opts: BarrellyOptions, tree: Tree<FileMetaData>): Promise<BarrelFileMetaData[]> {
    await tree.traverse(async (node: TreeNode<FileMetaData>) => {
        if (!node.parent) return
        if (node.isLeaf()) node.value.exportMeta = await countExports(node.value.path)
        handleMetadata(node, opts)
    })
    const filesArray: BarrelFileMetaData[] = []
    for (const [path, value] of files) filesArray.push({ imports: value.lines.sort(lexicCompare), path, exports: value.exports })
    filesArray.sort((a, b) => lexicCompare(a.path, b.path))
    return filesArray
}
