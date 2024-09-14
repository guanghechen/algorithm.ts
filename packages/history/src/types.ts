export type IEquals<T> = (x: T, y: T) => boolean
export type IFilter<T> = (element: T, index: number) => boolean

export interface IReadonlyHistory<T> {
  /**
   * Iterator the history by the order of push-in.
   */
  [Symbol.iterator](): IterableIterator<T>

  /**
   * Return the capacity of the history.
   * @getter
   */
  readonly capacity: number

  /**
   * Return the count of elements of the history.
   * @getter
   */
  readonly size: number

  /**
   * The name of the history.
   */
  readonly name: string

  /**
   * Used to check if two element in the history are same.
   */
  readonly equals: IEquals<T>

  /**
   * Count the element in the history which is matched the filter.
   */
  count(filter: IFilter<T>): number

  /**
   * Check if the present index is at the bottom of the history.
   */
  isBot(): boolean

  /**
   * Check if the present index is at the top of the history.
   */
  isTop(): boolean

  /**
   * Return the present element and present index of the history.
   */
  present(): [element: T | undefined, index: number]

  /**
   * Return the top element of the history.
   */
  top(): T | undefined
}

export interface IHistory<T> extends IReadonlyHistory<T> {
  /**
   * Backward `step` steps and return the present element of the history.
   * @param {?number} step  default is 1
   */
  backward(step?: number): [element: T | undefined, isBot: boolean]

  /**
   * Clear the history.
   */
  clear(): void

  /**
   * Create a new history from the current one.
   * @param {string} name The name of the new forked history.
   */
  fork(name: string): IHistory<T>

  /**
   * Forward `step` steps and return the present from the history.
   * @param {?number} step  default is 1
   */
  forward(step?: number): [element: T | undefined, isTop: boolean]

  /**
   * Set the present index to the given index and return the elements at the index of the history.
   * @param {?number} index
   */
  go(index?: number): T | undefined

  /**
   * Push the element to the history.
   * @param {T} element new element to push the history.
   */
  push(element: T): this

  /**
   * Rearrange the history and only keep the elements matched the given `filter`.
   * @param {IFilter<T>} filter function to filter the elements which should be preserve.
   */
  rearrange(filter: IFilter<T>): this

  /**
   * Change the top element of the history.
   * @param {T}  element The new value of the top index of the history.
   */
  updateTop(element: T): void
}
