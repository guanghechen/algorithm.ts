import type { IPriorityQueue } from './priority-queue.type'

/**
 * Create a priority queue, implementation based on a max-heap.
 *
 * For example:
 *
 *  createPriorityQueue<number>((x, y) => x - y) // => The top element has a maximum value.
 *  createPriorityQueue<number>((x, y) => y - x) // => The top element has a minimum value.
 *
 * @param cmp   Comparison function, if the result > 0, the element on the left
 *              side of the operator has higher precedence.
 * @returns
 */
export function createPriorityQueue<T>(
  cmp: (x: T, y: T) => -1 | 0 | 1 | number,
): IPriorityQueue<T> {
  const _tree: T[] = [null as unknown as T]
  let _size = 0

  return {
    init,
    enqueue,
    enqueues,
    dequeue,
    splice,
    replaceTop,
    top,
    collect,
    size: () => _size,
    isEmpty: () => _size < 1,
  }

  function _fastBuild(): void {
    // Build the heap with the initial elements.
    for (let q = _size; q > 1; q -= 2) _down(q >> 1)
  }

  /**
   * Build Priority Queue in O(N) time complexity.
   */
  function init(elements?: ReadonlyArray<T>, startIndex?: number, endIndex?: number): void {
    if (!elements) {
      _size = 0
      _tree.length = _size + 1
      return
    }

    const sIdx: number = Math.max(0, Math.min(elements.length, startIndex ?? 0))
    const tIdx: number = Math.max(sIdx, Math.min(elements.length, endIndex ?? elements.length))

    _size = tIdx - sIdx
    if (_tree.length <= _size) _tree.length = _size + 1
    for (let i = sIdx, k = 1; i < tIdx; ++i, ++k) _tree[k] = elements[i]
    _fastBuild()
  }

  function enqueue(element: T): void {
    // eslint-disable-next-line no-plusplus
    _tree[++_size] = element
    _up(_size)
  }

  function enqueues(elements: T[], startIndex?: number, endIndex?: number): void {
    const sIdx: number = Math.max(0, Math.min(elements.length, startIndex ?? 0))
    const tIdx: number = Math.max(sIdx, Math.min(elements.length, endIndex ?? elements.length))
    const N: number = tIdx - sIdx
    if (N < 5) {
      for (let i = sIdx; i < tIdx; ++i) enqueue(elements[i])
      return
    }

    let k = _size + 1
    _size += N
    if (_tree.length <= _size) _tree.length = _size + 1
    for (let i = sIdx; i < tIdx; ++i, ++k) _tree[k] = elements[i]
    _fastBuild()
  }

  function dequeue(): T | undefined {
    if (_size < 1) return undefined

    const target = _tree[1]
    // eslint-disable-next-line no-plusplus
    _tree[1] = _tree[_size--]
    _down(1)

    return target
  }

  function splice(
    filter: (element: T) => boolean,
    newElements?: ReadonlyArray<T>,
    startIndex?: number,
    endIndex?: number,
  ): void {
    let i = 0
    for (let j = 1; j <= _size; ++j) {
      const element: T = _tree[j]
      // eslint-disable-next-line no-plusplus
      if (filter(element)) _tree[++i] = element
    }

    if (newElements) {
      const L: number = newElements.length
      const sIdx: number = Math.max(0, Math.min(L, startIndex ?? 0))
      const tIdx: number = Math.max(sIdx, Math.min(L, endIndex ?? L))
      // eslint-disable-next-line no-plusplus
      for (let j = sIdx; j < tIdx; ++j) _tree[++i] = newElements[j]
    }

    _size = i
    _fastBuild()
  }

  function replaceTop(newElement: T): void {
    // eslint-disable-next-line no-plusplus
    if (_size < 1) _tree[++_size] = newElement
    else {
      _tree[1] = newElement
      _down(1)
    }
  }

  function top(): T | undefined {
    return _size > 0 ? _tree[1] : undefined
  }

  function collect(): T[] {
    return _tree.slice(1, _size + 1)
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
