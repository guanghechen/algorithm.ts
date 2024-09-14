import type { ICircularStack } from './types/circular'
import type { IFilter } from './types/stack'

export interface ICircularStackProps {
  /**
   * Initial capacity of the circular stack.
   */
  readonly capacity: number
}

export class CircularStack<T = unknown> implements ICircularStack<T> {
  protected readonly _elements: T[]
  protected _capacity: number
  protected _size: number
  protected _start: number
  protected _end: number

  constructor(props: ICircularStackProps) {
    const { capacity } = props
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new RangeError(
        `[CircularStack] capacity is expected to be a positive integer, but got (${capacity}).`,
      )
    }

    this._elements = new Array(capacity)
    this._capacity = capacity
    this._size = 0
    this._start = 0
    this._end = -1
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    const { _elements, _capacity, _size, _start, _end } = this
    if (_size === 0) return

    if (_start <= _end) {
      for (let i = _end; i >= _start; --i) yield _elements[i]
    } else {
      for (let i = _end; i >= 0; --i) yield _elements[i]
      for (let i = _capacity - 1; i >= _start; --i) yield _elements[i]
    }
  }

  public get capacity(): number {
    return this._capacity
  }

  public get size(): number {
    return this._size
  }

  public at(index: number): T | undefined {
    if (index < 0 || index >= this._size) return undefined
    let idx = this._start + index
    if (idx >= this._capacity) idx -= this._capacity
    return this._elements[idx]
  }

  public clear(): void {
    this._size = 0
    this._start = 0
    this._end = -1
  }

  public *consuming(): IterableIterator<T> {
    while (this._size > 0) {
      const target: T = this._elements[this._end]
      this._end = this._end === 0 ? this._capacity - 1 : this._end - 1
      this._size -= 1
      yield target
    }
  }

  public count(filter: IFilter<T>): number {
    const { _elements, _capacity, _size, _start, _end } = this
    if (_size < 1) return 0

    let count: number = 0
    if (_start <= _end) {
      for (let i = _start, k = 0; i <= _end; ++i, ++k) {
        if (filter(_elements[i], k)) count += 1
      }
    } else {
      let k: number = 0
      for (let i = _start; i < _capacity; ++i, ++k) if (filter(_elements[i], k)) count += 1
      for (let i = 0; i <= _end; ++i, ++k) if (filter(_elements[i], k)) count += 1
    }
    return count
  }

  public pop(): T | undefined {
    if (this._size < 1) return undefined

    const target = this._elements[this._end]
    if (this._size === 1) {
      this._size = 0
      this._start = 0
      this._end = -1
      return target
    }

    this._end = this._end === 0 ? this._capacity - 1 : this._end - 1
    this._size -= 1
    return target
  }

  public push(element: T): this {
    this._end = this._end + 1 === this._capacity ? 0 : this._end + 1
    this._elements[this._end] = element
    if (this._size < this._capacity) this._size += 1
    else this._start = this._start + 1 === this._capacity ? 0 : this._start + 1
    return this
  }

  public rearrange(filter: IFilter<T>): void {
    if (this._size < 1) return

    const elements: T[] = this._elements
    const capacity: number = this._capacity
    const start: number = this._start
    const end: number = this._end

    let size: number = 0
    if (start <= end) {
      for (let i = start, k = 0; i <= end; ++i, ++k) {
        const element: T = elements[i]
        if (filter(element, k)) elements[size++] = element
      }
    } else {
      const tmpArray: T[] = elements.slice(0, end + 1)

      let k: number = 0
      for (let i = start; i < capacity; ++i, ++k) {
        const element: T = elements[i]
        if (filter(element, k)) elements[size++] = element
      }
      for (let i = 0; i < tmpArray.length; ++i, ++k) {
        const element: T = tmpArray[i]
        if (filter(element, k)) elements[size++] = element
      }
      tmpArray.length = 0
    }

    this._size = size
    this._start = 0
    this._end = size - 1
  }

  public resize(nextCapacity: number): void {
    if (!Number.isInteger(nextCapacity) || nextCapacity < 1) {
      throw new RangeError(
        `[CircularStack] capacity is expected to be a positive integer, but got (${nextCapacity}).`,
      )
    }

    const elements: T[] = this._elements
    const capacity: number = this._capacity
    const start: number = this._start
    const end: number = this._end
    const shouldRemoved: number = this._size <= nextCapacity ? 0 : this._size - nextCapacity
    const remain: number = this._size - shouldRemoved

    let size: number = 0
    if (remain > 0) {
      if (start <= end) {
        for (let i = start + shouldRemoved; i <= end; ++i) {
          const element: T = elements[i]
          elements[size++] = element
        }
      } else {
        const tmpArray: T[] = elements.slice(0, end + 1)

        let i: number = start + shouldRemoved
        for (; i < capacity; ++i) {
          const element: T = elements[i]
          elements[size++] = element
        }
        for (i -= capacity; i < tmpArray.length; ++i) {
          const element: T = tmpArray[i]
          elements[size++] = element
        }
        tmpArray.length = 0
      }
    }

    this._capacity = nextCapacity
    this._size = size
    this._start = 0
    this._end = size - 1
  }

  public top(): T | undefined {
    return this._size === 0 ? undefined : this._elements[this._end]
  }

  public update(index: number, element: T): void {
    if (index < 0 || index >= this._size) return
    let idx = this._start + index
    if (idx >= this._capacity) idx -= this._capacity
    this._elements[idx] = element
  }
}
