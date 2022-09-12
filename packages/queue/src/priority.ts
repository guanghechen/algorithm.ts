import type { ICompare } from '@algorithm.ts/types'
import type { IPriorityQueue } from './types'

export interface IPriorityQueueProps<T> {
  /**
   * If the compare(x, y) < 0, then x has a higher precedence than y.
   */
  compare: ICompare<T>
}

/**
 * MinHeap
 */
export class PriorityQueue<T> implements IPriorityQueue<T> {
  protected readonly _compare: ICompare<T>
  protected readonly _elements: T[] = []
  protected _size = 0

  constructor(props: IPriorityQueueProps<T>) {
    this._compare = props.compare
  }

  public *[Symbol.iterator](): Iterator<T> {
    const { _elements, _size } = this
    for (let i = 1; i <= _size; ++i) yield _elements[i]
  }

  public init(elements: ReadonlyArray<T> = [], start = 0, end: number = elements.length): void {
    this.clear()
    if (start >= 0 && start < end && end <= elements.length) {
      const { _elements } = this
      for (let i = start, k = this._size; i < end; ++i) _elements[++k] = elements[i]
      this._size = end - start
      this._fastBuild()
    }
  }

  public enqueue(element: T): void {
    this._elements[++this._size] = element
    this._up(this._size)
  }

  public enqueues(elements: ReadonlyArray<T>, start = 0, end: number = elements.length): void {
    // eslint-disable-next-line no-param-reassign
    if (start < 0) start = 0
    // eslint-disable-next-line no-param-reassign
    if (end > elements.length) end = elements.length
    if (start >= end) return

    const N: number = end - start
    if (N * 4 < this._size) {
      for (let i = start; i < end; ++i) this.enqueue(elements[i])
      return
    }

    const { _elements } = this
    for (let i = start, k = this._size; i < end; ++i) _elements[++k] = elements[i]
    this._size += N
    this._fastBuild()
  }

  public dequeue(element?: T): T | undefined {
    if (this._size < 1) {
      if (element !== undefined) {
        this._size = 1
        this._elements[1] = element
      }
      return undefined
    }

    const target = this._elements[1]
    if (element !== undefined) {
      this._elements[1] = element
    } else {
      this._elements[1] = this._elements[this._size--]
    }
    this._down(1)
    return target
  }

  public splice(
    filter: (element: T) => boolean,
    elements: ReadonlyArray<T> = [],
    start = 0,
    end: number = elements.length,
  ): void {
    const { _size, _elements } = this

    let k = 0
    for (let i = 1; i <= _size; ++i) {
      const element: T = _elements[i]
      if (filter(element)) _elements[++k] = element
    }

    if (start >= 0 && start < end && end <= elements.length) {
      for (let i = start; i < end; ++i) _elements[++k] = elements[i]
    }

    this._size = k
    this._fastBuild()
  }

  public front(): T | undefined {
    return this._size > 0 ? this._elements[1] : undefined
  }

  public destroy(): void {
    this.clear()
    ;(this._elements as T[]) = null as unknown as T[]
  }

  public clear(): void {
    this._size = 0
  }

  public get size(): number {
    return this._size
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
