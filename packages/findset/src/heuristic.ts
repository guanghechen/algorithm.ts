import type { FindSet } from './ordinary'

/**
 * 启发式并查集，在普通并查集的基础上维护了每棵树的节点个数，在合并树时，始终采
 * 用节点数多的那棵的根节点作为新树的根节点，这样可以降低后续查询的执行次数。
 *
 * Heuristic find-set maintains the number of nodes of each tree on the basis
 * of the ordinary version. When merging trees, always use the root node of the
 * tree with more nodes as the root node of the new tree, which can reduce the
 * number of executions of subsequent queries.
 */
export interface HeuristicFindSet extends FindSet {
  /**
   * Size (number of the nodes) of the tree which x belongs.
   * @param x
   */
  size(x: number): number
}

/**
 * Create a heuristic find set.
 * @param MAX_N
 * @returns
 */
export function createHeuristicFindSet(MAX_N: number): HeuristicFindSet {
  const parent: number[] = new Array(MAX_N + 1)
  const count: number[] = new Array(MAX_N + 1)

  let _size: number = MAX_N
  return { init, root, merge, size }

  function init(N: number): void {
    _size = N
    for (let i = 1; i <= _size; ++i) {
      parent[i] = i
      count[i] = 1
    }
  }

  function root(x: number): number | never {
    if (x < 1 || x > _size)
      throw new RangeError(`Out of boundary [1, ${_size}]. x: ${x}`)
    return _root(x)
  }

  function merge(x: number, y: number): number {
    const xx = root(x)
    const yy = root(y)
    if (xx === yy) return xx

    if (count[xx] > count[yy]) {
      parent[yy] = xx
      count[xx] += count[yy]
      return xx
    }
    parent[xx] = yy
    count[yy] += count[xx]
    return yy
  }

  function size(x: number): number {
    const xx = root(x)
    return count[xx]
  }

  function _root(x: number): number | never {
    if (parent[x] === x) return x
    // eslint-disable-next-line no-return-assign
    return (parent[x] = _root(parent[x]))
  }
}
