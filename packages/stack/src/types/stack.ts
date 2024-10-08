export type IFilter<T> = (element: T, index: number) => boolean

export interface IReadonlyStack<T> {
  /**
   * .Iterator the stack by the reverse order of push-in.
   */
  [Symbol.iterator](): IterableIterator<T>

  /**
   * Return the capacity of the history.
   * @getter
   */
  readonly capacity: number

  /**
   * Count the element in the stack which is accepted by the filter.
   */
  count(filter: IFilter<T>): number

  /**
   * Get the top element of the stack.
   */
  top(): T | undefined
}

export interface IStack<T> extends IReadonlyStack<T> {
  /**
   * Clear the stack.
   */
  clear(): void
  /**
   * Popup the elements from the stack one by one.
   */
  consuming(): IterableIterator<T>
  /**
   * Fork the stack. (Similar as `clone`)
   */
  fork(): IStack<T>
  /**
   * Popup the front element from the stack.
   * @param newElement if specified, the element will be enstackd, it is for better performance.
   */
  pop(newElement?: T): T | undefined
  /**
   * Add an element to the tail of the stack.
   */
  push(element: T): this
  /**
   * Only preserve the elements matched the filter.
   */
  rearrange(filter: IFilter<T>): void
}
