export interface IEdge {
  /**
   * The other end of the edge.
   */
  to: number
  /**
   * The cost of walking along this side.
   */
  cost: number
}

export interface IGraph<E extends IEdge = IEdge> {
  /**
   * The number of nodes in the graph. (0-index)
   */
  N: number
  /**
   * Graph edges.
   */
  edges: ReadonlyArray<E>
  /**
   * Adjacency list. G[i] represent the index list of the edges start from node i.
   */
  G: ReadonlyArray<ReadonlyArray<number>>
}
