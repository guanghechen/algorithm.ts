export interface IDinicEdge {
  /**
   * The starting node of the arc.
   */
  readonly from: number
  /**
   * The ending node of the arc.
   */
  readonly to: number
  /**
   * Capacity of the arc.
   */
  readonly cap: number
  /**
   * Flow on the arc.
   */
  flow: number
}

export interface IDinic {
  /**
   * Initialize the Dinic algorithm.
   * @param source  the source node
   * @param sink    the sink node
   * @param n       the number of nodes
   */
  init(source: number, sink: number, n: number): void
  /**
   * Add an edge into the residual network.
   * @param from    the starting node
   * @param to      the ending node
   * @param cap     capacity
   */
  addEdge(from: number, to: number, cap: number): void
  /**
   * Calculate the maximum flow of the residual network.
   */
  maxflow(): number
  /**
   * Calculate the minium cut of the residual network.
   */
  mincut(): Array<Readonly<IDinicEdge>>
}
