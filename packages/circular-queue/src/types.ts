/**
 * Circular queue.
 *
 * Circular queue is a queue structure, the main purpose of its design is to
 * reuse space as much as possible on the basis of ordinary queues. Circular
 * queues usually need to specify the maximum volume C of the collector. If the
 * number of elements in the queue exceeds C, only the most recent C elements
 * are kept in the queue. Other operations are the same as ordinary queues.
 */
export interface CircularQueue<T> {
  /**
   * Initialize the circular queue: Resize the array & reset the start / end index.
   * @param MAX_SIZE
   */
  init(MAX_SIZE: number): void
  /**
   * Get the front element of the queue.
   */
  front(): T | undefined
  /**
   * Get the end element of the queue.
   */
  end(): T | undefined
  /**
   * Popup the front element from the queue.
   */
  dequeue(): T | undefined
  /**
   * Append an element.
   * @param element
   * @returns the index assigned to the element just appended
   */
  enqueue(element: T): number
  /**
   * Gets the element in the queue at the specified index.
   *
   * @param idx
   * @param strickCheck
   */
  get(idx: number, strickCheck?: boolean): T | undefined
  /**
   * Set the element at the specified index.
   *
   * @param idx
   * @param element
   */
  set(idx: number, element: T): boolean
  /**
   * Check if the given idx is a valid index of the circular queue.
   * @param idx
   */
  isValidIndex(idx: number): boolean
  /**
   * Get the number of elements in the queue.
   */
  size(): number
  /**
   * Whether the queue is empty.
   */
  isEmpty(): boolean
}
