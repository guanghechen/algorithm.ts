import type { IReadonlyStack, IStack } from './stack'

export interface IReadonlyCircularStack<T> extends IReadonlyStack<T> {
  /**
   * The count of the elements in the stack.
   * @getter
   */
  readonly size: number
}

export interface ICircularStack<T> extends IReadonlyCircularStack<T>, IStack<T> {
  /**
   * Get the element at the given index.
   */
  at(index: number): T | undefined
  /**
   * Resize the capacity of stack with the given size.
   */
  resize(capacity: number): void
  /**
   * Change the element at the given index.
   */
  update(index: number, element: T): void
}
