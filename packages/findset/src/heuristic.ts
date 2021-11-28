import type { Findset } from './ordinary'

/**
 * 启发式并查集，在普通并查集的基础上维护了每棵树的节点个数，在合并树时，始终采
 * 用节点数多的那棵的根节点作为新树的根节点，这样可以降低后续查询的执行次数。
 *
 * Heuristic find-set maintains the number of nodes of each tree on the basis
 * of the ordinary version. When merging trees, always use the root node of the
 * tree with more nodes as the root node of the new tree, which can reduce the
 * number of executions of subsequent queries.
 */
export interface HeuristicFindset extends Findset {
  /**
   * Size (number of the nodes) of the tree which x belongs.
   * @param x
   */
  size(x: number): number
}

/**
 * Create a heuristic find set.
 * @returns
 */
export function createHeuristicFindset(MAX_N: number): HeuristicFindset {
  const pa: Uint32Array = new Uint32Array(MAX_N + 1)
  const count: number[] = []
  return { init, initNode, root, merge, size }

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
    count[x] = 1
  }

  function root(x: number): number {
    if (x < 1 || x > MAX_N)
      throw new RangeError(`Out of boundary [1, ${MAX_N}]. x: ${x}`)
    return _root(x)
  }

  function merge(x: number, y: number): number {
    const xx = root(x)
    const yy = root(y)
    if (xx === yy) return xx

    if (count[xx] > count[yy]) {
      pa[yy] = xx
      count[xx] += count[yy]
      return xx
    }

    pa[xx] = yy
    count[yy] += count[xx]
    return yy
  }

  function size(x: number): number {
    const xx = root(x)
    return count[xx]
  }

  function _root(x: number): number {
    // eslint-disable-next-line no-return-assign
    return pa[x] === x ? x : (pa[x] = _root(pa[x]))
  }
}
