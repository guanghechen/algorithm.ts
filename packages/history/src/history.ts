import type { ICircularStack } from '@algorithm.ts/stack'
import { CircularStack } from '@algorithm.ts/stack'
import type { IEquals, IFilter, IHistory } from './types'

export interface IHistoryProps<T> {
  /**
   * The history name.
   */
  readonly name: string
  /**
   * Initial capacity of the circular history.
   */
  readonly capacity: number
  /**
   * Used to check if two element in the history are same.
   */
  readonly equals?: IEquals<T>
}

export class History<T = unknown> implements IHistory<T> {
  public readonly name: string
  public readonly equals: IEquals<T>
  protected readonly _stack: ICircularStack<T>
  protected _present: number

  constructor(props: IHistoryProps<T>) {
    const { capacity } = props
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new RangeError(
        `[History] capacity is expected to be a positive integer, but got (${capacity}).`,
      )
    }

    const { name, equals = (x, y) => x === y } = props
    const stack: ICircularStack<T> = new CircularStack<T>({ capacity })

    this.name = name
    this.equals = equals
    this._stack = stack
    this._present = -1
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    for (const element of this._stack) yield element
  }

  public get capacity(): number {
    return this._stack.capacity
  }

  public get size(): number {
    return this._stack.size
  }

  public backward(step: number = 1): [element: T | undefined, isBot: boolean] {
    const stack: ICircularStack<T> = this._stack
    if (stack.size < 1) return [undefined, true]

    const nextPresent: number = Math.min(stack.size - 1, Math.max(0, this._present - step))
    const element: T | undefined = stack.at(nextPresent)

    this._present = nextPresent
    return [element, nextPresent < 1]
  }

  public clear(): void {
    const top: T | undefined = this._stack.top()
    this._stack.clear()

    if (top !== undefined) {
      this._stack.push(top)
      this._present = 0
    } else {
      this._present = -1
    }
  }

  public count(filter: IFilter<T>): number {
    return this._stack.count(filter)
  }

  public fork(name: string): IHistory<T> {
    const capacity: number = this._stack.capacity
    const equals: IEquals<T> = this.equals
    const history = new History<T>({ name, capacity, equals })
    history._present = this._present
    ;(history._stack as ICircularStack<T>) = this._stack.fork()
    return history
  }

  public forward(step: number = 1): [element: T | undefined, isBot: boolean] {
    const stack: ICircularStack<T> = this._stack
    if (stack.size < 1) return [undefined, true]

    const nextPresent: number = Math.min(stack.size - 1, Math.max(0, this._present + step))
    const element: T | undefined = this._stack.at(nextPresent)

    this._present = nextPresent
    return [element, nextPresent + 1 === stack.size]
  }

  public go(index: number): T | undefined {
    const stack: ICircularStack<T> = this._stack
    if (stack.size < 1) return undefined

    const nextPresent: number = Math.min(stack.size - 1, Math.max(0, index))
    this._present = nextPresent
    return stack.at(nextPresent)
  }

  public isBot(): boolean {
    const stack: ICircularStack<T> = this._stack
    return stack.size < 1 || this._present === 0
  }

  public isTop(): boolean {
    const stack: ICircularStack<T> = this._stack
    return stack.size < 1 || this._present + 1 === stack.size
  }

  public present(): [element: T | undefined, index: number] {
    const stack: ICircularStack<T> = this._stack
    if (stack.size < 1) return [undefined, -1]

    const index: number = this._present
    const element: T | undefined = this._stack.at(index)
    return [element, index]
  }

  public push(element: T): this {
    const stack: ICircularStack<T> = this._stack
    const present: number = this._present
    const presentElement: T | undefined = stack.at(present)
    if (presentElement !== undefined && this.equals(element, presentElement)) return this

    if (present + 1 < stack.size) {
      const existedElement: T = stack.at(present + 1)!
      if (this.equals(element, existedElement)) {
        this._present += 1
        return this
      }
    }

    while (present + 1 < stack.size) stack.pop()
    stack.push(element)
    this._present = stack.size - 1
    return this
  }

  public rearrange(filter: IFilter<T>): this {
    const stack: ICircularStack<T> = this._stack
    const present: number = this._present
    let nextPresent: number = 0
    let idx: number = 0

    stack.rearrange((element, index) => {
      if (filter(element, index)) {
        if (index < present) nextPresent = idx
        idx += 1
        return true
      }
      return false
    })

    this._present = Math.max(stack.size - 1, nextPresent)
    return this
  }

  public top(): T | undefined {
    return this._stack.top()
  }

  public updateTop(element: T): void {
    const index: number = this._stack.size - 1
    this._stack.update(index, element)
  }
}
