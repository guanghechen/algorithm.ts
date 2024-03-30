import type { ICircularQueue } from './types/circular'

export interface IFixedCircularQueueProps {
  /**
   * Initial capacity of the circular queue.
   */
  readonly capacity: number
}

export class CircularQueue<T = unknown> implements ICircularQueue<T> {
  protected readonly _elements: T[]
  protected _capacity: number
  protected _size: number
  protected _start: number
  protected _end: number
  protected _destroyed: boolean

  constructor(props: IFixedCircularQueueProps) {
    const { capacity } = props
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new RangeError(
        `[CircularQueue] capacity is expected to be a positive integer, but got (${capacity}).`,
      )
    }

    this._elements = new Array(capacity)
    this._capacity = capacity
    this._size = 0
    this._start = 0
    this._end = -1
    this._destroyed = false
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    const { _elements, _capacity, _size, _start, _end } = this
    if (_size === 0) return

    if (_start <= _end) {
      for (let i = _start; i <= _end; ++i) yield _elements[i]
    } else {
      for (let i = _start; i < _capacity; ++i) yield _elements[i]
      for (let i = 0; i <= _end; ++i) yield _elements[i]
    }
  }

  public get destroyed(): boolean {
    return this._destroyed
  }

  public get size(): number {
    return this._size
  }

  public count(filter: (element: T) => boolean): number {
    const { _elements, _capacity, _size, _start, _end } = this
    if (_size == 0) return 0

    let count: number = 0
    if (_start <= _end) {
      for (let i = _start; i <= _end; ++i) if (filter(_elements[i])) count += 1
    } else {
      for (let i = _start; i < _capacity; ++i) if (filter(_elements[i])) count += 1
      for (let i = 0; i <= _end; ++i) if (filter(_elements[i])) count += 1
    }
    return count
  }

  public front(): T | undefined {
    return this._size === 0 ? undefined : this._elements[this._start]
  }

  public back(): T | undefined {
    return this._size === 0 ? undefined : this._elements[this._end]
  }

  public destroy(): void {
    if (this._destroyed) return
    this._destroyed = true

    this._elements.length = 0
    this._size = 0
    this._start = 0
    this._end = -1
  }

  public init(initialElements?: Iterable<T>): void {
    if (this._destroyed) {
      throw new Error('[CircularQueue] `init` is not allowed since it has been destroyed')
    }

    const _elements: T[] = this._elements
    const capacity: number = this._capacity
    let size: number = 0
    let start: number = 0
    let end: number = -1

    if (initialElements !== undefined) {
      for (const element of initialElements) {
        size += 1
        end = end + 1 === capacity ? 0 : end + 1
        _elements[end] = element
      }

      if (size > capacity) {
        size = capacity
        start = end + 1 === capacity ? 0 : end + 1
      }
    }

    this._size = size
    this._start = start
    this._end = end
  }

  public resize(newCapacity: number): void {
    if (!Number.isInteger(newCapacity) || newCapacity < 1) {
      throw new RangeError(
        `[CircularQueue] capacity is expected to be a positive integer, but got (${newCapacity}).`,
      )
    }
    if (this._size > newCapacity) {
      throw new RangeError('[CircularQueue] failed to resize, the new queue space is insufficient.')
    }
    this.rearrange()
    this._capacity = newCapacity
    this._elements.length = newCapacity
  }

  public rearrange(): void {
    if (this._start === 0) return

    const elements: T[] = this._elements
    const capacity: number = this._capacity
    const size: number = this._size
    const start: number = this._start
    const end: number = this._end

    if (start <= end) {
      let i = -1
      for (let k = start; i < size; ++k) elements[++i] = elements[k]
    } else {
      let i = -1
      const tmpArray: T[] = elements.slice(0, end + 1)
      for (let k = start; k < capacity; ++k) elements[++i] = elements[k]
      for (let k = 0; k < tmpArray.length; ++k) elements[++i] = tmpArray[k]
      tmpArray.length = 0
    }
    this._start = 0
    this._end = size - 1
  }

  public *consuming(): IterableIterator<T> {
    while (this._size > 0) {
      const target: T = this._elements[this._start]
      this._size -= 1
      this._start = this._start + 1 === this._capacity ? 0 : this._start + 1
      yield target
    }

    if (this._size === 0) {
      this._size = 0
      this._start = 0
      this._end = -1
    }
  }

  public dequeue(newElement?: T): T | undefined {
    if (this._size === 0) {
      if (newElement !== undefined) {
        this._size = 1
        this._start = 0
        this._end = 0
        this._elements[0] = newElement
      }
      return undefined
    }

    const target = this._elements[this._start]
    if (this._size === 1) {
      if (newElement === undefined) {
        this._size = 0
        this._start = 0
        this._end = -1
      } else {
        this._size = 1
        this._start = 0
        this._end = 0
        this._elements[0] = newElement
      }
      return target
    }

    this._start = this._start + 1 === this._capacity ? 0 : this._start + 1
    if (newElement === undefined) this._size -= 1
    else {
      this._end = this._end + 1 === this._capacity ? 0 : this._end + 1
      this._elements[this._end] = newElement
    }
    return target
  }

  public enqueue(element: T): void {
    this._end = this._end + 1 === this._capacity ? 0 : this._end + 1
    this._elements[this._end] = element
    if (this._size < this._capacity) this._size += 1
    else this._start = this._start + 1 === this._capacity ? 0 : this._start + 1
  }

  public enqueues(elements: Iterable<T>): void {
    const _elements: T[] = this._elements
    const capacity: number = this._capacity
    let size: number = this._size
    let start: number = this._start
    let end: number = this._end

    for (const element of elements) {
      size += 1
      end = end + 1 === capacity ? 0 : end + 1
      _elements[end] = element
    }

    if (size > capacity) {
      size = capacity
      start = end + 1 === capacity ? 0 : end + 1
    }

    this._size = size
    this._start = start
    this._end = end
  }

  public enqueues_advance(elements: ReadonlyArray<T>, start: number, end: number): void {
    if (end <= start) return
    const _elements: T[] = this._elements
    const capacity: number = this._capacity

    const count: number = end - start
    if (count >= capacity) {
      let _end: number = -1
      for (let i: number = end - capacity; i < end; ++i) _elements[++_end] = elements[i]
      this._size = capacity
      this._start = 0
      this._end = capacity - 1
      return
    }

    {
      let _end: number = this._end
      for (let i = start; i < end; ++i) {
        _end = _end + 1 === capacity ? 0 : _end + 1
        _elements[_end] = elements[i]
      }

      const size: number = this._size + count
      if (size < capacity) {
        this._size = size
        this._end = _end
      } else {
        const nextStart: number = this._start + size - capacity
        this._size = capacity
        this._end = _end
        this._start = nextStart >= capacity ? nextStart - capacity : nextStart
      }
    }
  }

  public exclude(filter: (element: T) => boolean): number {
    if (this._size === 0) return 0

    const elements: T[] = this._elements
    const capacity: number = this._capacity
    const start: number = this._start
    const end: number = this._end

    let size: number = 0
    if (start <= end) {
      for (let k = start; k <= end; ++k) {
        const element: T = elements[k]
        if (filter(element)) continue
        elements[size++] = element
      }
    } else {
      const tmpArray: T[] = elements.slice(0, end + 1)
      for (let k = start; k < capacity; ++k) {
        const element: T = elements[k]
        if (filter(element)) continue
        elements[size++] = element
      }
      for (let k = 0; k < tmpArray.length; ++k) {
        const element: T = tmpArray[k]
        if (filter(element)) continue
        elements[size++] = element
      }
      tmpArray.length = 0
    }

    const removedSize: number = this._size - size
    this._size = size
    this._start = 0
    this._end = size - 1
    return removedSize
  }

  public dequeue_back(): T | undefined {
    if (this._size === 0) return undefined

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

  public enqueue_front(element: T): void {
    // special case: end = -1
    if (this._size === 0) {
      this._size = 1
      this._start = 0
      this._end = 0
      this._elements[0] = element
      return
    }

    this._start = this._start === 0 ? this._capacity - 1 : this._start - 1
    this._elements[this._start] = element
    if (this._size < this._capacity) this._size += 1
    else this._end = this._end === 0 ? this._capacity - 1 : this._end - 1
  }

  public enqueues_front(elements: Iterable<T>): void {
    const _elements: T[] = this._elements
    const capacity: number = this._capacity
    let size: number = this._size
    let start: number = this._start
    let end: number = this._end

    for (const element of elements) {
      size += 1
      start = start === 0 ? capacity - 1 : start - 1
      _elements[start] = element
    }

    if (size > capacity) {
      size = capacity
      end = start === 0 ? capacity - 1 : start - 1
    }

    this._size = size
    this._start = start
    this._end = end
  }

  public enqueues_front_advance(elements: ReadonlyArray<T>, start: number, end: number): void {
    if (end <= start) return

    const _elements: T[] = this._elements
    const capacity: number = this._capacity

    const count: number = end - start
    if (count >= capacity) {
      let _start: number = capacity
      for (let i: number = end - capacity; i < end; ++i) _elements[--_start] = elements[i]
      this._size = capacity
      this._start = 0
      this._end = capacity - 1
      return
    }

    {
      let _start: number = this._start
      for (let i = start; i < end; ++i) {
        _start = _start === 0 ? capacity - 1 : _start - 1
        _elements[_start] = elements[i]
      }

      const size: number = this._size + count
      if (size < capacity) {
        this._size = size
        this._start = _start
      } else {
        const nextEnd: number = this._end - size + capacity
        this._size = capacity
        this._start = _start
        this._end = nextEnd < 0 ? nextEnd + capacity : nextEnd
      }
    }
  }
}
