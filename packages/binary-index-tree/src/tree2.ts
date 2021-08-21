import type { BinaryIndexTree } from './types'
import { lowbit } from './util'

/**
 * 创建一棵支持 *区间更新，单点查询* 的树状数组
 *
 * Create a binary search tree  for *interval update with single-point query*.
 *
 * @param ZERO    0 for number, 0n for bigint.
 * @returns
 */
export function createBinaryIndexTree2<T extends number | bigint>(
  ZERO: T,
): BinaryIndexTree<T> {
  let _size = 0
  const _nodes: T[] = [ZERO]

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
   * @param x
   * @param value
   */
  function add(x: number, value: T): void {
    for (let i = x; i > 0; i -= lowbit(i)) _nodes[i] += value as any
  }

  /**
   * Calculate the prefix sum of the first x elements of the array.
   * @param x
   */
  function query(x: number): T {
    if (x < 1) return ZERO
    let result = ZERO
    for (let i = x; i <= _size; i += lowbit(i)) {
      result += _nodes[i] as any
    }
    return result
  }

  return { init, add, query }
}
