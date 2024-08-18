import type { AsyncTraverser, Traverser, TreeMapper } from 'src/types/types'

export class TreeNode<T> {
    childCount: number
    children: TreeNode<T>[]
    readonly id: number
    readonly parent?: TreeNode<T>
    readonly value: T

    constructor(id: number, value: T, parent?: TreeNode<T>) {
        this.id = id
        this.value = value
        this.parent = parent
        this.children = []
        this.childCount = 0
    }

    add(id: number, value: T): this {
        this.children.push(new TreeNode(id, value, this))
        this.childCount++
        return this
    }

    insert(id: number, value: T): this {
        this.children.unshift(new TreeNode(id, value, this))
        this.childCount++
        return this
    }

    isChildOf(node: TreeNode<T>): boolean {
        return this.parent?.id === node.id
    }

    isLeaf(): boolean {
        return !this.childCount
    }

    isParentOf(node: TreeNode<T>): boolean {
        const childCount = this.childCount
        if (!childCount) return false
        const children = this.children
        const id = node.id
        for (let i = 0; i < childCount; i++) if (children[i].id === id) return true
        return false
    }

    isRoot(): boolean {
        return !this.parent
    }
}

export default class Tree<T> {
    counter: number
    root: TreeNode<T>

    constructor(rootValue: T) {
        this.counter = 0
        this.root = new TreeNode(this.counter++, rootValue)
    }

    add(value: T, traverser: TreeMapper<T>, equalizer: TreeMapper<T>, currentNode = this.root): void {
        if (currentNode.isLeaf()) {
            currentNode.add(this.counter++, value)
            return
        }
        const children = currentNode.children
        const childCount = currentNode.childCount
        let child: TreeNode<T>
        for (let i = 0; i < childCount; i++) {
            child = children[i]
            if (equalizer(child, value)) return
            if (traverser(child, value)) {
                this.add(value, traverser, equalizer, child)
                return
            }
        }
        currentNode.add(this.counter++, value)
    }

    insert(value: T, traverser: TreeMapper<T>, equalizer: TreeMapper<T>, currentNode = this.root): void {
        if (currentNode.isLeaf()) {
            currentNode.insert(this.counter++, value)
            return
        }
        const children = currentNode.children
        const childCount = currentNode.childCount
        let child: TreeNode<T>
        for (let i = 0; i < childCount; i++) {
            child = children[i]
            if (equalizer(child, value)) return
            if (traverser(child, value)) {
                this.insert(value, traverser, equalizer, child)
                return
            }
        }
        currentNode.insert(this.counter++, value)
    }

    async traverse(traverser: AsyncTraverser<T>, root = this.root): Promise<void> {
        if (root.isLeaf()) await traverser(root)
        else {
            const length = root.childCount
            const promises: Promise<void>[] = new Array(length)
            for (let i = 0; i < length; i++) promises[i] = this.traverse(traverser, root.children[i])
            promises.push(traverser(root))
            await Promise.all(promises)
        }
    }

    remove(remover: Traverser<T>, traverser: Traverser<T>, root = this.root): void {
        if (root.isLeaf()) return
        const length = root.childCount
        const children = root.children
        let child: TreeNode<T>
        for (let i = 0; i < length; i++) {
            child = children[i]
            if (!child) return
            if (traverser(child)) this.remove(remover, traverser, child)
            if (remover(child)) {
                children.splice(children.indexOf(child), 1)
                this.counter--
                root.childCount--
            }
        }
    }
}
