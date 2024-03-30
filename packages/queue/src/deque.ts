import type { IDeque } from './types/deque'

interface IDequeNode<T> {
  value: T
  prev: IDequeNode<T> | undefined
  next: IDequeNode<T> | undefined
}

export class Deque<T = unknown> implements IDeque<T> {
  protected readonly _pool: Array<IDequeNode<T>>
  protected _poolSize: number
  protected _size: number
  protected _head: IDequeNode<T> | undefined
  protected _tail: IDequeNode<T> | undefined
  protected _destroyed: boolean

  constructor() {
    this._pool = []
    this._poolSize = 0
    this._size = 0
    this._head = undefined
    this._tail = undefined
    this._destroyed = false
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    for (let current = this._head; current !== undefined; current = current.next) {
      yield current.value
    }
  }

  public get destroyed(): boolean {
    return this._destroyed
  }

  public get size(): number {
    return this._size
  }

  public count(filter: (element: T) => boolean): number {
    let count: number = 0
    for (let current = this._head; current !== undefined; current = current.next) {
      if (filter(current.value)) count += 1
    }
    return count
  }

  public front(): T | undefined {
    return this._head?.value
  }

  public back(): T | undefined {
    return this._tail?.value
  }

  public destroy(): void {
    if (this._destroyed) return
    this._destroyed = true

    for (let current = this._head, next: IDequeNode<T> | undefined; current !== undefined; ) {
      next = current.next
      current.prev = undefined
      current.next = undefined
      current = next
    }

    this._pool.length = 0
    this._poolSize = 0
    this._size = 0
    this._head = undefined
    this._tail = undefined
  }

  public init(initialElements?: Iterable<T>): void {
    if (this._destroyed) {
      throw new Error('[Deque] `init` is not allowed since it has been destroyed')
    }

    const pool: Array<IDequeNode<T>> = this._pool
    let poolSize: number = this._poolSize

    for (let current = this._head, next: IDequeNode<T> | undefined; current !== undefined; ) {
      pool[poolSize++] = current
      next = current.next
      current.prev = undefined
      current.next = undefined
      current = next
    }

    this._poolSize = poolSize
    this._size = 0
    this._head = undefined
    this._tail = undefined

    if (initialElements !== undefined) this.enqueues(initialElements)
  }

  public *consuming(): IterableIterator<T> {
    const pool: Array<IDequeNode<T>> = this._pool
    let poolSize: number = this._poolSize
    while (this._head !== undefined) {
      const node: IDequeNode<T> = this._head
      const next: IDequeNode<T> | undefined = this._head.next
      this._head = next
      if (next === undefined) this._tail = undefined
      this._size -= 1

      pool[poolSize++] = node
      node.prev = undefined
      node.next = undefined
      if (next !== undefined) next.prev = undefined

      yield node.value
    }
  }

  public dequeue(newElement?: T | undefined): T | undefined {
    if (newElement === undefined) {
      if (this._head === undefined) return undefined

      this._size -= 1
      const node: IDequeNode<T> = this._head
      const next: IDequeNode<T> | undefined = node.next
      this._head = next

      this._pool[this._poolSize++] = node
      node.prev = undefined
      node.next = undefined

      if (next === undefined) this._tail = undefined
      else next.prev = undefined
      return node.value
    }

    // size === 0
    if (this._head === undefined) {
      let node: IDequeNode<T>
      if (this._poolSize > 0) {
        node = this._pool[--this._poolSize]
        node.value = newElement
      } else {
        node = { value: newElement, prev: undefined, next: undefined }
      }

      this._size = 1
      this._head = this._tail = node
      return undefined
    }

    const result: T = this._head.value
    this._head.value = newElement

    if (this.size > 1) {
      const node: IDequeNode<T> = this._head
      const next: IDequeNode<T> = node.next!

      next.prev = undefined
      node.prev = this._tail
      node.next = undefined

      this._tail!.next = node
      this._tail = node
      this._head = next
    }

    return result
  }

  public enqueue(element: T): void {
    let node: IDequeNode<T>
    if (this._poolSize > 0) {
      node = this._pool[--this._poolSize]
      node.value = element
    } else {
      node = { value: element, prev: undefined, next: undefined }
    }

    this._size += 1
    if (this._tail === undefined) this._head = this._tail = node
    else {
      node.prev = this._tail
      this._tail.next = node
      this._tail = node
    }
  }

  public enqueues(elements: Iterable<T>): void {
    for (const element of elements) this.enqueue(element)
  }

  public enqueues_advance(elements: ReadonlyArray<T>, start: number, end: number): void {
    if (end <= start) return
    for (let i = start; i < end; ++i) this.enqueue(elements[i])
  }

  public exclude(filter: (element: T) => boolean): number {
    if (this._size === 0) return 0

    const pool: Array<IDequeNode<T>> = this._pool
    let poolSize: number = this._poolSize

    let count: number = 0
    let prev: IDequeNode<T> | undefined
    let next: IDequeNode<T> | undefined
    let last: IDequeNode<T> | undefined
    for (let current = this._head; current !== undefined; current = next) {
      next = current.next

      if (filter(current.value)) {
        if (current === this._head) this._head = next

        count += 1

        pool[poolSize++] = current
        current.prev = undefined
        current.next = undefined

        if (next !== undefined) next.prev = prev
        if (prev !== undefined) prev.next = next
      } else {
        prev = current
        last = current
      }
    }

    this._size -= count
    this._tail = last
    return count
  }

  public dequeue_back(): T | undefined {
    if (this._tail === undefined) return undefined

    this._size -= 1
    const node: IDequeNode<T> = this._tail
    const prev: IDequeNode<T> | undefined = node.prev
    this._tail = prev

    this._pool[this._poolSize++] = node
    node.prev = undefined
    node.next = undefined

    if (prev === undefined) this._head = undefined
    else prev.next = undefined
    return node.value
  }

  public enqueue_front(element: T): void {
    let node: IDequeNode<T>
    if (this._poolSize > 0) {
      node = this._pool[--this._poolSize]
      node.value = element
    } else {
      node = { value: element, prev: undefined, next: undefined }
    }

    this._size += 1
    if (this._head === undefined) this._head = this._tail = node
    else {
      node.next = this._head
      this._head.prev = node
      this._head = node
    }
  }

  public enqueues_front(elements: Iterable<T>): void {
    for (const element of elements) this.enqueue_front(element)
  }

  public enqueues_front_advance(elements: ReadonlyArray<T>, start: number, end: number): void {
    if (end <= start) return
    for (let i = start; i < end; ++i) this.enqueue_front(elements[i])
  }
}
