export interface IBipartiteMatching {
  /**
   * The number of pairs of the maximum bipartite-matching.
   */
  count: number
  /**
   * partners[i]=j represent that node-i is paired with node-j.
   */
  partners: number[]
}

export interface IBipartiteMatcher {
  /**
   * Release memory.
   */
  clear(): void
  /**
   * Initialize the algorithm.
   * @param N the number of nodes
   */
  init(N: number): void
  /**
   * Add an edge connect node-u and node-v in both directions.
   * @param u a node number (start from 0)
   * @param v a node number (start from 0)
   */
  addEdge(u: number, v: number): void
  /**
   * Find a maximum bipartite-matching.
   *
   * @returns
   *  - count: the number of pairs of the maximum bipartite-matching.
   *  - partners: partners[i]=j represent that node-i is paired with node-j.
   */
  maxMatch(): IBipartiteMatching
  /**
   * Check if exists a perfect match.
   */
  isPerfectMatch(): boolean
}
