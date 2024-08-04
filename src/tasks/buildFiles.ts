import { basename, extname } from 'node:path'
import type { TreeNode } from 'src/structures/Tree'
import type Tree from 'src/structures/Tree'
import type { BarrelFileMetaData, BarrellyOptions, FileMetaData } from 'src/types/interfaces'
import countExports from './countExports'

const files = new Map<string, Set<string>>()

function getMetaData(currentNode: TreeNode<FileMetaData>): Set<string> {
    const parentPath = currentNode.parent?.value.path ?? currentNode.value.path
    if (files.has(parentPath)) return files.get(parentPath)!
    const metadata = new Set<string>()
    files.set(parentPath, metadata)
    return metadata
}

function shouldEscapeExtension(value: FileMetaData, ext: string, aliases: string[]): boolean {
    return !value.dir && (ext === '.ts' || (!!aliases.length && aliases.includes(ext)))
}

function getExportContent(value: FileMetaData, opts: BarrellyOptions): string {
    const path = value.path
    const ext = extname(path)
    const exportName = basename(path)
    const relPath = `from './${shouldEscapeExtension(value, ext, opts.aliases) ? exportName.split('.')[0] : exportName}'`
    if (value.dir || value.exportCount > 1) return `export * ${relPath}`
    return `export { default as ${exportName.substring(0, exportName.indexOf('.'))} } ${relPath}${opts.semi ? ';' : ''}`
}

function hasNoExports(value: FileMetaData, shouldCount: boolean): boolean {
    return shouldCount && !value.exportCount
}

export default async function buildFiles(opts: BarrellyOptions, tree: Tree<FileMetaData>): Promise<BarrelFileMetaData[]> {
    const shouldCount = opts.countExports
    await tree.traverse(
        async (node: TreeNode<FileMetaData>) => {
            const children = node.children
            const childCount = node.childCount
            const metadata = getMetaData(node)
            if (node.parent) metadata.add(getExportContent(node.value, opts))
            let child: TreeNode<FileMetaData>, value: FileMetaData
            for (let i = 0; i < childCount; i++) {
                child = children[i]
                value = child.value
                if (child.isLeaf() || value.dir || hasNoExports(value, shouldCount)) continue
                metadata.add(getExportContent(value, opts))
            }
        },
        async (leaf: TreeNode<FileMetaData>) => {
            const value = leaf.value
            if (shouldCount) value.exportCount = await countExports(value.path)
            if (!value.exportCount) return
            getMetaData(leaf).add(getExportContent(value, opts))
        }
    )
    const filesArray: BarrelFileMetaData[] = []
    for (const [path, value] of files) filesArray.push({ imports: Array.from(value).sort(), path })
    filesArray.sort((a, b) => a.path.length - b.path.length)
    return filesArray
}
