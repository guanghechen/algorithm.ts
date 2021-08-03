/**
 * Priority queue.
 *
 * Priority queue can insert elements within the complexity of log(N) or remove
 * the largest element in the queue.
 */
export interface PriorityQueue<T> {
  /**
   * Init priority queue with initial elements.
   * @param elements
   */
  init(elements: ReadonlyArray<T>): void
  /**
   * Drop a element into the priority queue.
   */
  enqueue(val: T): void
  /**
   * Popup the top element.
   */
  dequeue(): T | undefined
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

/**
 * Create a priority queue, implementation based on a max-heap.
 *
 * @param cmp   Comparison function, if the result > 0, the element on the left
 *              side of the operator has higher precedence.
 * @returns
 */
export function createPriorityQueue<T>(
  cmp: (x: T, y: T) => -1 | 0 | 1 | number,
): PriorityQueue<T> {
  const _tree: T[] = [null as unknown as T]
  let _size = 0

  return {
    init,
    enqueue,
    dequeue,
    top,
    collect,
    size: () => _size,
    isEmpty: () => _size < 1,
  }

  /**
   * Build Priority Queue in O(N) time complexity.
   * @param elements
   * @returns
   */
  function init(elements: ReadonlyArray<T>): void {
    _size = Math.max(0, elements.length)
    for (let i = 0; i < _size; ++i) _tree[i + 1] = elements[i]
    for (let q = _size; q > 1; q -= 2) _down(q >> 1)
  }

  function enqueue(val: T): void {
    // eslint-disable-next-line no-plusplus
    _tree[++_size] = val
    _up(_size)
  }

  function dequeue(): T | undefined {
    if (_size < 1) return undefined

    const target = _tree[1]
    // eslint-disable-next-line no-plusplus
    _tree[1] = _tree[_size--]
    _down(1)

    return target
  }

  function top(): T | undefined {
    return _size > 0 ? _tree[1] : undefined
  }

  function collect(): T[] {
    return _tree.slice(1)
  }

  function _down(index: number): void {
    for (let p = index; p <= _size; ) {
      const lft = p << 1
      const rht = lft | 1
      if (lft > _size) break

      const q = rht <= _size && cmp(_tree[rht], _tree[lft]) > 0 ? rht : lft
      const tmp = _tree[q]

      if (cmp(_tree[p], tmp) >= 0) break

      _tree[q] = _tree[p]
      _tree[p] = tmp
      p = q
    }
  }

  function _up(index: number): void {
    for (let i = index; i > 1; ) {
      const q = i >> 1
      const x = _tree[q]
      if (cmp(x, _tree[i]) >= 0) break

      _tree[q] = _tree[i]
      _tree[i] = x
      i = q
    }
  }
}
