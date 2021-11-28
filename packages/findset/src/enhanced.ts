import type { Findset } from './ordinary'

/**
 * Enhanced findset.
 *
 * On the basis of ordinary findset, this enhanced version also supports to get
 * all the nodes on a given tree (access through the root node).
 *
 * Example:
 *
 *  findset = createEnhancedFindset(20)
 *
 *  findset.initNode
 *  findset.merge(2)
 */
export interface EnhancedFindset extends Findset {
  /**
   * Size (number of the nodes) of the tree which x belongs.
   * @param x
   */
  size(x: number): number
  /**
   * Get the set which contains all nodes of the tree which x belongs.
   * @param x
   */
  getSetOf(x: number): Readonly<Set<number>> | undefined
}

/**
 * Create an enhanced findset.
 * @param MAX_N  max nodes in the findset.
 * @returns
 */
export function createEnhancedFindset(MAX_N: number): EnhancedFindset {
  const pa: Uint32Array = new Uint32Array(MAX_N + 1)
  const sets: Array<Set<number>> = new Array(MAX_N + 1)
  for (let i = 0; i <= MAX_N; ++i) sets[i] = new Set()
  return { init, root, merge, initNode, size, getSetOf }

  function init(N: number): void {
    if (N < 1 || N > MAX_N) {
      throw new TypeError(
        `Invalid value, expect an integer in the range of [1, ${MAX_N}], but got ${N}.`,
      )
    }

    for (let x = 1; x <= N; ++x) initNode(x)
  }

  function root(x: number): number {
    if (x < 1 || x > MAX_N)
      throw new RangeError(`Out of boundary [1, ${MAX_N}]. x: ${x}`)
    return _root(x)
  }

  function merge(x: number, y: number): number {
    let xx: number = root(x)
    let yy: number = root(y)
    if (xx === yy) return xx

    // Heuristic combination
    if (sets[xx].size < sets[yy].size) {
      const t: number = xx
      xx = yy
      yy = t
    }

    // Merge two set.
    for (const t of sets[yy]) sets[xx].add(t)
    sets[yy].clear()

    // eslint-disable-next-line no-return-assign
    return (pa[yy] = xx)
  }

  function initNode(x: number): void {
    pa[x] = x
    sets[x].clear()
    sets[x].add(x)
  }

  function size(x: number): number {
    const xx: number = root(x)
    return sets[xx].size
  }

  function getSetOf(x: number): Readonly<Set<number>> {
    const xx: number = root(x)
    return sets[xx]
  }

  function _root(x: number): number {
    // eslint-disable-next-line no-return-assign
    return pa[x] === x ? x : (pa[x] = _root(pa[x]))
  }
}
