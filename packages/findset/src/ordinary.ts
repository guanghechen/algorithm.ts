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
export interface FindSet {
  /**
   * Initialize the findSet.
   * @param N
   */
  init(N: number): void
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
export function createFindSet(): FindSet {
  const parent: number[] = []
  let _size = 0
  return { init, root, merge }

  function init(N: number): void {
    _size = N
    if (parent.length <= _size) parent.length = _size + 1
    for (let i = 1; i <= N; ++i) parent[i] = i
  }

  function root(x: number): number {
    if (x < 1 || x > _size)
      throw new RangeError(`Out of boundary [1, ${_size}]. x: ${x}`)
    return _root(x)
  }

  function merge(x: number, y: number): number {
    const xx = root(x)
    const yy = root(y)
    if (xx === yy) return xx

    if (xx < yy) {
      parent[yy] = xx
      return xx
    }
    parent[xx] = yy
    return yy
  }

  function _root(x: number): number | never {
    if (parent[x] === x) return x
    // eslint-disable-next-line no-return-assign
    return (parent[x] = _root(parent[x]))
  }
}
