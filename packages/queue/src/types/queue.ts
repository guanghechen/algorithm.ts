export interface IReadonlyQueue<T> {
  /**
   * Iterable.
   */
  [Symbol.iterator](): IterableIterator<T>

  /**
   * Determine whether the data-structure is destroyed.
   */
  readonly destroyed: boolean

  /**
   * Count the element in the collection.
   * @getter
   */
  readonly size: number

  /**
   * Count the element in the queue which is accepted by the filter.
   */
  count(filter: (element: T) => boolean): number

  /**
   * Get the front element of the queue.
   */
  front(): T | undefined
}

export interface IQueue<T> extends IReadonlyQueue<T> {
  /**
   * Destroy the data-structure.
   */
  destroy(): void
  /**
   * Reset the collection and insert the initial elements.
   */
  init(initialElements?: Iterable<T>): void
  /**
   * Popup the elements from the queue by the `dequeue` order.
   * Once the queue first empty, the iterator will be ended.
   */
  consuming(): IterableIterator<T>
  /**
   * Popup the front element from the queue.
   * @param newElement if specified, the element will be enqueued, it is for better performance.
   */
  dequeue(newElement?: T): T | undefined
  /**
   * Add an element to the tail of the queue.
   */
  enqueue(element: T): void
  /**
   * Add multiple elements to the tail of the queue.
   */
  enqueues(elements: Iterable<T>): void
  /**
   * Add multiple elements to the tail of the queue.
   *
   * !!!You should ensure the `start` and `end` are valid index by yourself.!!!
   */
  enqueues_advance(elements: ReadonlyArray<T>, start: number, end: number): void
  /**
   * Remove existed elements which is accepted by the filter,
   * @returns the number of removed elements.
   */
  exclude(filter: (element: T) => boolean): number
}
