import type { ICircularQueue } from './types'

export interface ICircularQueueProps {
  /**
   * Initial capacity of the circular queue.
   */
  capacity?: number
  /**
   * Automatically extends the queue capacity when the queue is full.
   * @default true
   */
  autoResize?: boolean
  /**
   * @default 1.5
   */
  autoResizeExpansionRatio?: number
}

export class CircularQueue<T = unknown> implements ICircularQueue<T> {
  protected readonly _elements: T[]
  protected readonly _autoResize: (nextExpectedSize: number) => void
  protected _capacity: number
  protected _size: number
  protected _start: number
  protected _end: number

  constructor(props: ICircularQueueProps = {}) {
    const { capacity = 16, autoResize = true, autoResizeExpansionRatio = 1.5 } = props
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new RangeError(
        `[CircularQueue] capacity is expected to be a positive integer, but got (${capacity}).`,
      )
    }

    if (autoResize && autoResizeExpansionRatio < 1.2) {
      throw new RangeError(
        `[CircularQueue] autoResizeExpansionRatio is expected to be a number greater than 1.2, but got (${autoResizeExpansionRatio}).`,
      )
    }

    this._capacity = capacity
    this._size = 0
    this._start = 0
    this._end = -1

    this._elements = new Array(capacity)
    this._autoResize = autoResize
      ? (nextExpectedSize: number): void | never => {
          if (nextExpectedSize <= this._capacity) return
          const nextCapacity = Math.ceil(this._capacity * autoResizeExpansionRatio)
          this.resize(Math.max(nextCapacity, nextExpectedSize))
        }
      : () => {}
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    const { _elements, _size, _start, _capacity } = this
    if (_size == 0) return

    const natureCount: number = _capacity - _start
    if (_size <= natureCount) {
      for (let i = _start, _end = _start + _size; i < _end; ++i) yield _elements[i]
      return
    }

    for (let i = _start, _end = _capacity; i < _end; ++i) yield _elements[i]
    for (let i = 0, _end = _size - natureCount; i < _end; ++i) yield _elements[i]
  }

  public init(elements: ReadonlyArray<T> = [], start = 0, end: number = elements.length): void {
    this.clear()

    // eslint-disable-next-line no-param-reassign
    if (start < 0) start = 0
    // eslint-disable-next-line no-param-reassign
    if (end > elements.length) end = elements.length
    if (start >= end) return

    const count = end - start
    if (count > this._capacity) this._capacity = count

    const { _elements } = this
    for (let i = 0, k = start; k < end; ++i, ++k) _elements[i] = elements[k]

    this._size = count
    this._start = 0
    this._end = count - 1
  }

  public resize(MAX_SIZE: number): void {
    if (this._size > MAX_SIZE) {
      throw new RangeError(`[CircularQueue] failed to resize, the new queue space is insufficient.`)
    }
    this.rearrange()
    this._capacity = MAX_SIZE
  }

  public enqueue(element: T): void {
    this._autoResize(this._size + 1)
    this._end = this._forwardIndex(this._end)
    this._elements[this._end] = element
    if (this._size < this._capacity) this._size += 1
    else this._start = this._forwardIndex(this._start)
  }

  public unshift(element: T): void {
    if (this._size === 0) this.enqueue(element)
    else {
      this._autoResize(this._size + 1)
      this._start = this._backwardIndex(this._start)
      this._elements[this._start] = element
      if (this._size < this._capacity) this._size += 1
      else this._end = this._backwardIndex(this._end)
    }
  }

  public enqueues(elements: ReadonlyArray<T>, start = 0, end: number = elements.length): void {
    // eslint-disable-next-line no-param-reassign
    if (start < 0) start = 0
    // eslint-disable-next-line no-param-reassign
    if (end > elements.length) end = elements.length
    if (start >= end) return

    const cnt = end - start
    const nextSize = this._size + cnt
    this._autoResize(nextSize)

    const { _capacity, _elements } = this
    if (nextSize < _capacity) {
      for (let k = start; k < end; k++) {
        this._end = this._forwardIndex(this._end)
        _elements[this._end] = elements[k]
      }
      this._size += cnt
    } else {
      if (cnt < _capacity) {
        this._start = (this._start + nextSize - _capacity) % _capacity
        for (let k = start; k < end; ++k) {
          this._end = this._forwardIndex(this._end)
          _elements[this._end] = elements[k]
        }
        this._size = _capacity
      } else {
        for (let i = 0, k = start + cnt - _capacity; i < _capacity; ++i, ++k) {
          _elements[i] = elements[k]
        }
        this._size = _capacity
        this._start = 0
        this._end = _capacity - 1
      }
    }
  }

  public dequeue(element?: T): T | undefined {
    if (this._size === 0) {
      if (element !== undefined) {
        this._elements[0] = element
        this._size = 1
        this._start = 0
        this._end = 0
      }
      return undefined
    }

    const target = this._elements[this._start]
    this._start = this._forwardIndex(this._start)
    if (element === undefined) this._size -= 1
    else {
      this._end = this._forwardIndex(this._end)
      this._elements[this._end] = element
    }
    return target
  }

  public pop(): T | undefined {
    if (this._size === 0) return undefined
    this._size -= 1
    const target = this._elements[this._end]
    this._end = this._backwardIndex(this._end)
    return target
  }

  public splice(
    filter: (element: T) => boolean,
    elements?: ReadonlyArray<T> | undefined,
    start?: number | undefined,
    end?: number | undefined,
  ): void {
    let nextSize = 0
    let nextEnd = this._start
    const { _elements } = this
    for (const element of this) {
      if (filter(element)) {
        _elements[nextEnd] = element
        nextEnd = this._forwardIndex(nextEnd)
        nextSize += 1
      }
    }

    this._size = nextSize
    this._end = this._backwardIndex(nextEnd)
    if (elements !== undefined) this.enqueues(elements, start, end)
  }

  public front(): T | undefined {
    return this._size === 0 ? undefined : this._elements[this._start]
  }

  public back(): T | undefined {
    return this._size === 0 ? undefined : this._elements[this._end]
  }

  public rearrange(): void {
    if (this._start === 0) return

    const { _elements, _start, _size } = this
    if (_size > 0) {
      if (_start + _size <= this._capacity) {
        for (let i = 0, k = _start; i < _size; ++i, ++k) _elements[i] = _elements[k]
      } else {
        const tmpArray: T[] = []
        for (const x of this) tmpArray.push(x)
        for (let i = 0; i < _size; ++i) _elements[i] = tmpArray[i]
        tmpArray.length = 0
      }
    }

    this._start = 0
    this._end = _size - 1
  }

  public destroy(): void {
    this._capacity = 0
    this.clear()
    ;(this._elements as T[]) = null as unknown as T[]
  }

  public clear(): void {
    this._size = 0
    this._start = 0
    this._end = -1
  }

  public get size(): number {
    return this._size
  }

  protected _forwardIndex(index: number): number {
    const nextIndex = index + 1
    return nextIndex === this._capacity ? 0 : nextIndex
  }

  protected _backwardIndex(index: number): number {
    const nextIndex = index - 1
    return nextIndex < 0 ? this._capacity + nextIndex : nextIndex
  }
}
