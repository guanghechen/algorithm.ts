/**
 * Adjacent list
 */
export type IAdjacentList = number[][]

export interface IDigraphEdge {
  /**
   * Target point of the edge.
   */
  to: number
}

export interface IDigraph<E extends IDigraphEdge = IDigraphEdge> {
  /**
   * The number of nodes in the graph. (0-index)
   */
  N: number
  /**
   * Adjacency list. G[i] represent the index list of the edges start from node i.
   */
  G: number[][]
  /**
   *
   */
  edges: E[]
}
