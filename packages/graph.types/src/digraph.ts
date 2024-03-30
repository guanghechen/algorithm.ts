/**
 * Adjacent list
 */
export type IAdjacentList = number[][]

export interface IDigraphEdge {
  /**
   * Target point of the edge.
   */
  readonly to: number
}

export interface IDigraph<E extends IDigraphEdge = IDigraphEdge> {
  /**
   * The number of nodes in the graph. (0-index)
   */
  readonly N: number
  /**
   * Adjacency list. G[i] represent the index list of the edges start from node i.
   */
  readonly G: number[][]
  /**
   *
   */
  readonly edges: E[]
}
