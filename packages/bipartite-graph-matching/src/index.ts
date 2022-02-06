export interface IBipartiteGraphMatching {
  /**
   * Initialize the algorithm.
   * @param N total node ids start from 0.
   */
  init(N: number): void
  /**
   * Add an edge in the bipartite graph.
   * @param u
   * @param v
   */
  addEdge(u: number, v: number): void
  /**
   * @returns maximum matching number of pairs in a bipartite graph.
   */
  maxMatch(): number
  /**
   * Check whether if exists a perfect match.
   */
  perfectMatch(): boolean
}

/**
 * @see https://me.guanghechen.com/post/algorithm/graph/bipartite-graph/
 */
export function createBipartiteGraphMatching(): IBipartiteGraphMatching {
  let _N = 0
  const _G: number[][] = []
  const _visited: boolean[] = []
  const _partner: number[] = []
  return { init, addEdge, maxMatch, perfectMatch }

  function init(N: number): void {
    if (N <= 0) {
      throw new Error('The number of nodes should be greater than zero.')
    }

    _N = N

    if (_partner.length < N) {
      _partner.length = N
    }

    if (_G.length < N) {
      _G.length = N
    }
    for (let i = 0; i < N; i += 1) {
      _G[i] = []
    }

    if (_visited.length < N) {
      _visited.length = N
    }
  }

  function addEdge(u: number, v: number): void {
    _G[u].push(v)
    _G[v].push(u)
  }

  function match(u: number): boolean {
    for (const v of _G[u]) {
      if (_visited[v]) {
        continue
      }
      _visited[v] = true

      if (_partner[v] < 0 || match(_partner[v])) {
        _partner[u] = v
        _partner[v] = u
        return true
      }
    }
    return false
  }

  function maxMatch(): number {
    _partner.fill(-1, 0, _N)

    let total = 0
    for (let u = 0; u < _N; u += 1) {
      if (_partner[u] < 0) {
        _visited.fill(false, 0, _N)
        _visited[u] = true
        if (match(u)) {
          total += 1
        }
      }
    }
    return total
  }

  function perfectMatch(): boolean {
    if (_N % 2 === 1) {
      return false
    }

    const targetPairs: number = _N / 2
    for (let i = 0; i < _N; i += 1) {
      if (_G[i].length <= 0) {
        return false
      }
    }

    return maxMatch() === targetPairs
  }
}
