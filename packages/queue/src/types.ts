import type { ICollection } from '@algorithm.ts/types'

export interface IQueue<T> extends ICollection<T> {
  /**
   * Initialize queue with initial elements.
   * @param elements
   * @param start
   * @param end
   */
  init(elements?: ReadonlyArray<T>, start?: number, end?: number): void
  /**
   * Add an element to the tail of the queue.
   * @param element
   */
  enqueue(element: T): void
  /**
   * Add multiple elements to the tail of the queue.
   * @param elements
   * @param start
   * @param end
   */
  enqueues(elements: ReadonlyArray<T>, start?: number, end?: number): void
  /**
   * Popup the front element from the queue.
   * @param newElement if specified, the element will be enqueued, this parameter is just for better performance.
   */
  dequeue(newElement?: T): T | undefined
  /**
   * Remove existed elements which is not accepted by the filter, then enqueues the additional elements.
   * @param filter
   * @param elements
   * @param start         start index of `newElements`
   * @param end           end index of `newElements`
   */
  splice(
    filter: (element: T) => boolean,
    elements?: ReadonlyArray<T>,
    start?: number,
    end?: number,
  ): void
  /**
   * Get the front element of the queue.
   */
  front(): T | undefined
}

export interface IDeque<T> extends IQueue<T> {
  /**
   * Popup the last element of the queue.
   */
  pop(): T | undefined
  /**
   * Get the last element of the queue.
   */
  back(): T | undefined
  /**
   * Add an element to the head of the queue.
   */
  unshift(element: T): void
}

/**
 * Circular queue.
 *
 * Circular queue is a queue structure, the main purpose of its design is to
 * reuse space as much as possible on the basis of ordinary queues. Circular
 * queues usually need to specify the maximum volume C of the collector. If the
 * number of elements in the queue exceeds C, only the most recent C elements
 * are kept in the queue. Other operations are the same as ordinary queues.
 */
export interface ICircularQueue<T> extends IQueue<T>, IDeque<T> {
  /**
   * Resize the max-size of queue with the given size.
   * @param MAX_SIZE
   */
  resize(MAX_SIZE: number): void
  /**
   * Rearrange elements, that is, put the first element in place 0-index.
   */
  rearrange(): void
}

/**
 * Priority queue.
 *
 * Priority queue can insert elements within the complexity of log(N) or remove
 * the largest element in the queue.
 */
export type IPriorityQueue<T> = IQueue<T>
