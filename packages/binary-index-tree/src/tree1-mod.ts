import type { BinaryIndexTree } from './types'
import { lowbit } from './util'

/**
 * 创建一棵支持 *单点更新，区间查询* 的树状数组，所有的更新和查询操作均需对某个
 * 数进行取模，且所有数值应在范围 (-MOD, MOD) 之间。
 *
 * Create a binary search tree for *single-point update with interval query*.
 * All update and query operations need to be modulo a certain number, and all
 * values should be in the range (-MOD, MOD).
 *
 * @param ZERO    0 for number, 0n for bigint.
 * @param MOD
 * @returns
 */
export function createBinaryIndexTree1Mod<T extends number | bigint>(
  ZERO: T,
  MOD: T,
): BinaryIndexTree<T> {
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
   * @param value   value \in (-MOD, MOD)
   */
  function add(xth: number, value: T): void {
    if (xth < 1) return
    // eslint-disable-next-line no-param-reassign
    if (value < 0) value += MOD as any
    for (let i = xth; i <= _size; i += lowbit(i)) {
      _nodes[i] = modAdd(_nodes[i], value)
    }
  }

  /**
   * Calculate the prefix sum of the first x elements of the array.
   * @param xth
   */
  function query(xth: number): T {
    let result = ZERO
    for (let i = xth; i > 0; i -= lowbit(i)) {
      result = modAdd(result, _nodes[i])
    }
    return result
  }

  /**
   * @param x   x \in [0, MOD)
   * @param y   y \in [0, MOD)
   * @returns
   */
  function modAdd(x: T, y: T): T {
    const result: any = (x as any) + (y as any)
    return result >= MOD ? result - MOD : result
  }
}
