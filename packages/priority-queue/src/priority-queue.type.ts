/**
 * Priority queue.
 *
 * Priority queue can insert elements within the complexity of log(N) or remove
 * the largest element in the queue.
 */
export interface IPriorityQueue<T> {
  /**
   * Initialize priority queue with initial elements.
   * @param elements
   * @param startIndex
   * @param endIndex
   */
  init(elements?: ReadonlyArray<T>, startIndex?: number, endIndex?: number): void
  /**
   * Drop a element into the priority queue.
   * @param element
   */
  enqueue(element: T): void
  /**
   * Drop multiple elements into the priority queue.
   * @param elements
   */
  enqueues(elements: ReadonlyArray<T>, startIndex?: number, endIndex?: number): void
  /**
   * Popup the top element.
   */
  dequeue(): T | undefined
  /**
   * Remove existed elements which is not passed the filter, then enqueues the additional elements.
   * @param filter
   * @param newElements
   * @param startIndex    start index of `newElements`
   * @param endIndex      end index of `newElements`
   */
  splice(
    filter: (element: T) => boolean,
    newElements?: ReadonlyArray<T>,
    startIndex?: number,
    endIndex?: number,
  ): void
  /**
   * Get the top element.
   */
  top(): T | undefined
  /**
   * Return the number of elements of the priority queue.
   */
  size(): number
  /**
   * Check if the priority queue is empty.
   */
  isEmpty(): boolean
  /**
   * Return all of the elements of the priority queue.
   */
  collect(): T[]
}
