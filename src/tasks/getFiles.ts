import type { BarrellyOptions, FileMetaData } from 'src/types/interfaces'
import { fdir } from 'fdir'
import { join } from 'node:path'
import Tree, { TreeNode } from 'src/structures/Tree'
import isDir from 'src/utils/guards/isDir'
import picomatch from 'picomatch'
import { cwd, EmptyExportMetadata } from 'src/constants'

function mapper(childNode: TreeNode<FileMetaData>, value: FileMetaData): boolean {
    return value.path.includes(childNode.value.path)
}

function equal(childNode: TreeNode<FileMetaData>, value: FileMetaData): boolean {
    return value.path === childNode.value.path
}

export default async function getFiles(opts: BarrellyOptions): Promise<Tree<FileMetaData> | undefined> {
    const matcher = picomatch(`./**/*${opts.glob}`)
    const walker = new fdir()
        .withDirs()
        .withFullPaths()
        .filter((path, isDirectory) => !path.includes('index') && (isDirectory || matcher(path)))
    if (opts.exportEverything) walker.withBasePath()
    const paths = await walker.crawl(join(cwd, opts.path)).withPromise()
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
    return hasFiles ? tree : undefined
}
