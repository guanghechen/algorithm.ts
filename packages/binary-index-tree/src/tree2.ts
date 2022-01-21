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
export function createBinaryIndexTree2<T extends number | bigint>(ZERO: T): BinaryIndexTree<T> {
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
   * Add value to the numbers which index in the range of [1, xth].
   * @param xth
   * @param value
   */
  function add(xth: number, value: T): void {
    for (let i = xth; i > 0; i -= lowbit(i)) _nodes[i] += value as any
  }

  /**
   * Get the value of the xth number.
   * @param xth
   */
  function query(xth: number): T {
    if (xth < 1) return ZERO
    let result = ZERO
    for (let i = xth; i <= _size; i += lowbit(i)) {
      result += _nodes[i] as any
    }
    return result
  }

  return { init, add, query }
}
