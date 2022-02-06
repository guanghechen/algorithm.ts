/**
 * Circular queue.
 *
 * Circular queue is a queue structure, the main purpose of its design is to
 * reuse space as much as possible on the basis of ordinary queues. Circular
 * queues usually need to specify the maximum volume C of the collector. If the
 * number of elements in the queue exceeds C, only the most recent C elements
 * are kept in the queue. Other operations are the same as ordinary queues.
 */
export interface ICircularQueue<T> {
  /**
   * Initialize the circular queue: Resize the array & reset the start / end index.
   * @param MAX_SIZE
   */
  init(MAX_SIZE: number): void
  /**
   * Free memory.
   */
  destroy(): void
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

/**
 * Create a circular queue.
 * @param MAX_SIZE
 * @returns
 */
export function createCircularQueue<T>(): ICircularQueue<T> {
  let _MAX_SIZE = 0
  let _size = 0
  const _queue: T[] = []
  let _startIndex = 0
  let _endIndex = 0

  return {
    init,
    destroy,
    front,
    end,
    dequeue,
    enqueue,
    get,
    set,
    isValidIndex,
    size,
    isEmpty,
  }

  function init(MAX_SIZE: number): void {
    _MAX_SIZE = Math.max(2, MAX_SIZE)
    if (_queue.length < MAX_SIZE) _queue.length = _MAX_SIZE

    _size = 0
    _startIndex = 0
    _endIndex = 0
  }

  function destroy(): void {
    _MAX_SIZE = 0
    _size = 0
    _queue.length = 0
    _startIndex = -1
    _endIndex = -1
  }

  function front(): T | undefined {
    return _size === 0 ? undefined : _queue[_startIndex]
  }

  function end(): T | undefined {
    if (_size === 0) return undefined
    const index = _endIndex === 0 ? _MAX_SIZE - 1 : _endIndex - 1
    return _queue[index]
  }

  function dequeue(): T | undefined {
    if (_size === 0) return undefined

    const element: T = _queue[_startIndex]

    _size -= 1
    _startIndex += 1
    if (_startIndex === _MAX_SIZE) _startIndex = 0
    return element
  }

  function enqueue(element: T): number {
    const index: number = _endIndex
    _queue[index] = element

    _endIndex += 1
    if (_endIndex === _MAX_SIZE) _endIndex = 0

    if (_size < _MAX_SIZE) _size += 1
    else _startIndex = _endIndex
    return index
  }

  function get(idx: number, strickCheck = true): T | undefined {
    if (strickCheck && !isValidIndex(idx)) return undefined
    return _queue[idx]
  }

  function set(idx: number, element: T): boolean {
    if (isValidIndex(idx)) {
      _queue[idx] = element
      return true
    }
    return false
  }

  function isValidIndex(idx: number): boolean {
    if (_size === 0) return false
    if (idx < 0 || idx >= _MAX_SIZE) return false
    if (_startIndex < _endIndex) return idx >= _startIndex && idx < _endIndex
    return idx >= _startIndex || idx < _endIndex
  }

  function size(): number {
    return _size
  }

  function isEmpty(): boolean {
    return _size === 0
  }
}
