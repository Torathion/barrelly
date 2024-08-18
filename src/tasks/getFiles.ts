import type { BarrellyOptions, FileMetaData } from 'src/types/interfaces'
import { fdir } from 'fdir'
import { join, normalize } from 'node:path'
import Tree, { TreeNode } from 'src/structures/Tree'
import isDir from 'src/utils/guards/isDir'
import picomatch from 'picomatch'
import { cwd, EmptyExportMetadata } from 'src/constants'
import { normalizePath } from 'src/utils'

function mapper(childNode: TreeNode<FileMetaData>, value: FileMetaData): boolean {
    return value.path.includes(childNode.value.path)
}

function equal(childNode: TreeNode<FileMetaData>, value: FileMetaData): boolean {
    return value.path === childNode.value.path
}

const cwd = process.cwd()

function parseIgnoreFolders(opts: BarrellyOptions): string[] {
    const ignoreFolders = opts.ignore
    const len = ignoreFolders.length
    for (let i = 0; i < len; i++) ignoreFolders[i] = normalizePath(ignoreFolders[i])
    return ignoreFolders
}

export default async function getFiles(opts: BarrellyOptions): Promise<Tree<FileMetaData> | undefined> {
    // Parse the folders to ignore
    const ignoreLen = opts.ignore.length
    const ignoreFolders: string[] = ignoreLen ? parseIgnoreFolders(opts) : []
    const normedRoot = normalizePath(opts.path)
    // If the root is ignore, return
    if (ignoreFolders.includes(normedRoot)) return undefined
    const matcher = picomatch(`./**/*${opts.glob}`)
    const walker = new fdir()
        .withDirs()
        .withFullPaths()
        .filter((path, isDirectory) => {
            for (let i = 0; i < ignoreLen; i++) if (path.includes(ignoreFolders[i])) return false
            return !path.includes('index') && (isDirectory || matcher(path))
        })
    if (opts.exportEverything) walker.withBasePath()
    // Get paths, return if no paths were found
    const paths = await walker.crawl(normedRoot).withPromise()
    if (!paths.length) return undefined
    paths.sort((a, b) => a.length - b.length)
    // the root folder is always the shortest path
    const root = paths.shift()!
    const tree = new Tree<FileMetaData>({ dir: isDir(root), exportMeta: EmptyExportMetadata, path: root })
    const length = paths.length
    // Check if there are paths with extensions
    let hasFiles = false
    let path: string, dir: boolean
    for (let i = 0; i < length; i++) {
        path = paths[i]
        dir = isDir(path)
        if (dir) tree.add({ dir, exportMeta: EmptyExportMetadata, path }, mapper, equal)
        else {
            tree.insert({ dir, exportMeta: EmptyExportMetadata, path }, mapper, equal)
            hasFiles = true
        }
    }
    if (!hasFiles) return undefined
    // Remove empty folder
    tree.remove(
        (node: TreeNode<FileMetaData>) => node.isLeaf() && !!node.value.dir,
        (node: TreeNode<FileMetaData>) => !!node.value.dir && !node.isLeaf()
    )
    return hasFiles ? tree : undefined
}
