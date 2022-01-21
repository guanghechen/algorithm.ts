/**
 * 并查集是一个数据结构，用于维护一个森林中的节点关系，可以在均摊常数时间复杂度
 * 下执行下述操作：
 *
 * 1. 判断两个节点是否处于同义棵树中
 * 2. 合并两棵树
 *
 * The find-set is a data structure used to maintain the node relationship in a
 * forest. Find set support to perform the following operations under the
 * amortized constant time complexity:
 *
 * 1. Determine whether two nodes are in a synonymous tree.
 * 2. Merge two trees.
 */
export interface Findset {
  /**
   * Initialize the findset .
   * @param N
   */
  init(N: number): void
  /**
   * Initialize a specified node in the findset.
   * @param x
   */
  initNode(x: number): void
  /**
   * Find the root element of x.
   * @param x
   */
  root(x: number): number
  /**
   * Merge two tree.
   * @param x
   * @param y
   * @returns the new root
   */
  merge(x: number, y: number): number
}

/**
 * Create a find set.
 * @returns
 */
export function createFindset(MAX_N: number): Findset {
  const pa: Uint32Array = new Uint32Array(MAX_N + 1)
  return { init, initNode, root, merge }

  function init(N: number): void {
    if (N < 1 || N > MAX_N) {
      throw new TypeError(
        `Invalid value, expect an integer in the range of [1, ${MAX_N}], but got ${N}.`,
      )
    }

    for (let x = 1; x <= N; ++x) initNode(x)
  }

  function initNode(x: number): void {
    pa[x] = x
  }

  function root(x: number): number {
    if (x < 1 || x > MAX_N) throw new RangeError(`Out of boundary [1, ${MAX_N}]. x: ${x}`)
    return _root(x)
  }

  function merge(x: number, y: number): number {
    const xx = root(x)
    const yy = root(y)
    if (xx === yy) return xx

    if (xx < yy) {
      pa[yy] = xx
      return xx
    }

    pa[xx] = yy
    return yy
  }

  function _root(x: number): number {
    // eslint-disable-next-line no-return-assign
    return pa[x] === x ? x : (pa[x] = _root(pa[x]))
  }
}
