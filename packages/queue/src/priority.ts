import type { ICompare } from '@algorithm.ts/internal'
import type { IPriorityQueue } from './types/priority'

export interface IPriorityQueueProps<T> {
  /**
   * If the compare(x, y) < 0, then x has a higher priority than y.
   */
  compare: ICompare<T>
}

/**
 * MinHeap
 */
export class PriorityQueue<T> implements IPriorityQueue<T> {
  protected readonly _compare: ICompare<T>
  protected readonly _elements: T[]
  protected _size: number
  protected _destroyed: boolean

  constructor(props: IPriorityQueueProps<T>) {
    this._elements = []
    this._size = 0
    this._destroyed = false
    this._compare = props.compare
  }

  /**
   * !!NOTICE!! The iterator will not be sorted.
   */
  public *[Symbol.iterator](): IterableIterator<T> {
    const { _elements, _size } = this
    for (let i = 1; i <= _size; ++i) yield _elements[i]
  }

  public get destroyed(): boolean {
    return this._destroyed
  }

  public get size(): number {
    return this._size
  }

  public count(filter: (element: T) => boolean): number {
    const { _elements, _size } = this
    let count: number = 0
    for (let i = 1; i <= _size; ++i) if (filter(_elements[i])) count += 1
    return count
  }

  public front(): T | undefined {
    return this._size > 0 ? this._elements[1] : undefined
  }

  public destroy(): void {
    if (this._destroyed) return
    this._destroyed = true

    this._size = 0
    this._elements.length = 0
  }

  public init(initialElements?: Iterable<T>): void {
    if (this._destroyed) {
      throw new Error('[PriorityQueue] `init` is not allowed since it has been destroyed')
    }

    let size: number = 0

    if (initialElements !== undefined) {
      const { _elements } = this
      for (const element of initialElements) _elements[++size] = element
    }

    this._size = size
    this._fastBuild()
  }

  public *consuming(): IterableIterator<T> {
    while (this._size > 0) {
      const target: T = this._elements[1]
      this._elements[1] = this._elements[this._size--]
      this._down(1)
      yield target
    }
  }

  public dequeue(element?: T): T | undefined {
    if (this._size === 0) {
      if (element !== undefined) {
        this._size = 1
        this._elements[1] = element
      }
      return undefined
    }

    const target: T = this._elements[1]
    if (element !== undefined) this._elements[1] = element
    else this._elements[1] = this._elements[this._size--]

    this._down(1)
    return target
  }

  public enqueue(element: T): void {
    this._elements[++this._size] = element
    this._up(this._size)
  }

  public enqueues(elements: Iterable<T>): void {
    const _elements: T[] = this._elements
    const size: number = this._size
    let nextSize: number = size
    for (const element of elements) _elements[++nextSize] = element

    if (nextSize === size) return

    this._size = nextSize
    const newAddedCount: number = nextSize - size
    if (newAddedCount * Math.log2(nextSize) > nextSize) this._fastBuild()
    else for (let i = size + 1; i <= nextSize; ++i) this._up(i)
  }

  public enqueues_advance(elements: ReadonlyArray<T>, start: number, end: number): void {
    if (end <= start) return

    const _elements: T[] = this._elements
    const size: number = this._size

    let nextSize: number = size
    for (let i = start; i < end; ++i) _elements[++nextSize] = elements[i]

    this._size = nextSize
    const newAddedCount: number = end - start
    if (newAddedCount * Math.log2(nextSize) > nextSize) this._fastBuild()
    else for (let i = size + 1; i <= nextSize; ++i) this._up(i)
  }

  public exclude(filter: (element: T) => boolean): number {
    let size: number = 0
    const _elements: T[] = this._elements
    for (let i = 1, N = this._size + 1; i < N; ++i) {
      const element: T = _elements[i]
      if (filter(element)) continue
      _elements[++size] = element
    }

    const removedSize: number = this._size - size
    if (removedSize === 0) return 0

    this._size = size
    this._fastBuild()
    return removedSize
  }

  protected _down(index: number): void {
    const { _elements, _size, _compare } = this
    for (let p = index, q: number; p <= _size; p = q) {
      const lft = p << 1
      const rht = lft | 1
      if (lft > _size) break

      q = rht <= _size && _compare(_elements[rht], _elements[lft]) < 0 ? rht : lft
      const tmp = _elements[q]
      if (_compare(_elements[p], tmp) <= 0) break
      _elements[q] = _elements[p]
      _elements[p] = tmp
    }
  }

  protected _up(index: number): void {
    const { _elements, _compare } = this
    for (let q = index, p: number; q > 1; q = p) {
      p = q >> 1
      const tmp = _elements[q]
      if (_compare(_elements[p], tmp) <= 0) break
      _elements[q] = _elements[p]
      _elements[p] = tmp
    }
  }

  // Build the heap with the initial elements.
  protected _fastBuild(): void {
    for (let p = this._size >> 1; p > 0; --p) this._down(p)
  }
}
