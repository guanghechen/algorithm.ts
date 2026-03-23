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
    for (let i = 0; i < _size; ++i) yield _elements[i]
  }

  public get destroyed(): boolean {
    return this._destroyed
  }

  public get size(): number {
    return this._size
  }

  public count(filter: (element: T) => boolean): number {
    const { _elements, _size } = this
    let count = 0
    for (let i = 0; i < _size; ++i) if (filter(_elements[i])) count += 1
    return count
  }

  public front(): T | undefined {
    return this._size > 0 ? this._elements[0] : undefined
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

    let size = 0

    if (initialElements !== undefined) {
      const { _elements } = this
      for (const element of initialElements) {
        _elements[size] = element
        size += 1
      }
    }

    this._size = size
    this._elements.length = size
    this._fastBuild()
  }

  public *consuming(): IterableIterator<T> {
    while (this._size > 0) {
      const target: T = this._elements[0]
      this._size -= 1
      if (this._size > 0) {
        this._elements[0] = this._elements[this._size]
        this._downToBottomThenUp(0)
      }
      yield target
    }
  }

  public dequeue(element?: T): T | undefined {
    if (this._size === 0) {
      if (element !== undefined) {
        this._size = 1
        this._elements[0] = element
      }
      return undefined
    }

    const target: T = this._elements[0]
    if (element !== undefined) {
      this._elements[0] = element
      this._downToBottomThenUp(0)
      return target
    }

    this._size -= 1
    if (this._size > 0) {
      this._elements[0] = this._elements[this._size]
      this._downToBottomThenUp(0)
    }
    return target
  }

  public enqueue(element: T): void {
    const index: number = this._size
    this._elements[index] = element
    this._size += 1
    this._up(index)
  }

  public enqueues(elements: Iterable<T>): void {
    const _elements: T[] = this._elements
    const size: number = this._size
    let nextSize: number = size
    for (const element of elements) {
      _elements[nextSize] = element
      nextSize += 1
    }

    if (nextSize === size) return

    this._size = nextSize
    const newAddedCount: number = nextSize - size
    if (newAddedCount * Math.log2(nextSize) > nextSize) this._fastBuild()
    else for (let i = size; i < nextSize; ++i) this._up(i)
  }

  public enqueues_advance(elements: ReadonlyArray<T>, start: number, end: number): void {
    if (end <= start) return

    const _elements: T[] = this._elements
    const size: number = this._size

    let nextSize: number = size
    for (let i = start; i < end; ++i) {
      _elements[nextSize] = elements[i]
      nextSize += 1
    }

    this._size = nextSize
    const newAddedCount: number = end - start
    if (newAddedCount * Math.log2(nextSize) > nextSize) this._fastBuild()
    else for (let i = size; i < nextSize; ++i) this._up(i)
  }

  public exclude(filter: (element: T) => boolean): number {
    let size = 0
    const _elements: T[] = this._elements
    for (let i = 0, N = this._size; i < N; ++i) {
      const element: T = _elements[i]
      if (filter(element)) continue
      _elements[size] = element
      size += 1
    }

    const removedSize: number = this._size - size
    if (removedSize === 0) return 0

    this._size = size
    _elements.length = size
    this._fastBuild()
    return removedSize
  }

  protected _down(index: number): void {
    const { _elements, _size, _compare } = this
    if (index < 0 || index >= _size) return

    const item: T = _elements[index]
    let p = index

    for (let q = (p << 1) + 1; q < _size; q = (p << 1) + 1) {
      const rht = q + 1
      if (rht < _size && _compare(_elements[rht], _elements[q]) < 0) q = rht

      const child: T = _elements[q]
      if (_compare(item, child) <= 0) break

      _elements[p] = child
      p = q
    }

    _elements[p] = item
  }

  protected _downToBottomThenUp(index: number): void {
    const { _elements, _size, _compare } = this
    if (index < 0 || index >= _size) return

    const item: T = _elements[index]
    let p = index
    let q = (p << 1) + 1

    while (q + 1 < _size) {
      if (_compare(_elements[q + 1], _elements[q]) < 0) q += 1
      _elements[p] = _elements[q]
      p = q
      q = (p << 1) + 1
    }

    if (q < _size) {
      _elements[p] = _elements[q]
      p = q
    }

    while (p > index) {
      const parent = (p - 1) >> 1
      const parentElement: T = _elements[parent]
      if (_compare(parentElement, item) <= 0) break

      _elements[p] = parentElement
      p = parent
    }

    _elements[p] = item
  }

  protected _up(index: number): void {
    const { _elements, _compare } = this
    if (index <= 0 || index >= this._size) return

    const item: T = _elements[index]
    let q = index

    while (q > 0) {
      const p = (q - 1) >> 1
      const parent: T = _elements[p]
      if (_compare(parent, item) <= 0) break

      _elements[q] = parent
      q = p
    }

    _elements[q] = item
  }

  // Build the heap with the initial elements.
  protected _fastBuild(): void {
    for (let p = (this._size >> 1) - 1; p >= 0; --p) this._down(p)
  }
}
