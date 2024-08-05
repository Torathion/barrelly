import type { TreeNode } from 'src/structures/Tree'

export type TreeMapper<T> = (currentNode: TreeNode<T>, value: T) => boolean
export type Traverser<T> = (currentNode: TreeNode<T>) => boolean
export type AsyncTraverser<T> = (currentNode: TreeNode<T>) => Promise<void>

export type ArgumentType = 'boolean' | 'string' | 'string[]' | 'boolean[]'
export type ArgumentValue<T> = T extends 'string' ? string[] | string : boolean[] | boolean
export type PackageJsonDependencyTypes = 'dependencies' | 'devDependencies' | 'optionalDependencies' | 'peerDependencies'
