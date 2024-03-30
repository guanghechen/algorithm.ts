import type { IQueue, IReadonlyQueue } from './queue'

export interface IReadonlyDeque<T> extends IReadonlyQueue<T> {
  /**
   * Get the last element of the queue.
   */
  back(): T | undefined
}

export interface IDeque<T> extends IReadonlyDeque<T>, IQueue<T> {
  /**
   * Popup the last element of the queue.
   */
  dequeue_back(): T | undefined
  /**
   * Add an element to the front of the queue.
   */
  enqueue_front(element: T): void
  /**
   * Add multiple elements to the front of the queue.
   */
  enqueues_front(elements: Iterable<T>): void
  /**
   * Add multiple elements to the front of the queue.
   *
   * !!!You should ensure the `start` and `end` are valid index by yourself.!!!
   */
  enqueues_front_advance(elements: ReadonlyArray<T>, start: number, end: number): void
}
