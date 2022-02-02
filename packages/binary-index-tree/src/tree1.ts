import type { IBinaryIndexTree } from './types'
import { lowbit } from './util'

/**
 * 创建一棵支持 *单点更新，区间查询* 的树状数组
 *
 * Create a binary search tree for *single-point update with interval query*.
 *
 * @param ZERO    0 for number, 0n for bigint.
 * @returns
 */
export function createBinaryIndexTree1<T extends number | bigint>(ZERO: T): IBinaryIndexTree<T> {
  let _size = 0
  const _nodes: T[] = [ZERO]
  return { init, add, query }

  /**
   * Initialize the BinarySearchTree.
   * @param N
   */
  function init(N: number): void {
    _size = N
    if (_nodes.length <= _size) _nodes.length = _size + 1
    _nodes.fill(ZERO, 1, _size + 1)
  }

  /**
   * Add value to the xth number
   * @param xth
   * @param value
   */
  function add(xth: number, value: T): void {
    if (xth < 1) return
    for (let i = xth; i <= _size; i += lowbit(i)) {
      _nodes[i] += value as any
    }
  }

  /**
   * Calculate the prefix sum of the first x elements of the array.
   * @param xth
   */
  function query(xth: number): T {
    let result = ZERO
    for (let i = xth; i > 0; i -= lowbit(i)) {
      result += _nodes[i] as any
    }
    return result
  }
}
