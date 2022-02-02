/**
 * 残量网络中的一条弧
 * An arc in the residual network.
 */
export interface IMcmfEdge {
  /**
   * The starting node of the arc.
   */
  from: number
  /**
   * The ending node of the arc.
   */
  to: number
  /**
   * Capacity of the arc.
   */
  cap: number
  /**
   * Flow on the arc.
   */
  flow: number
  /**
   * Price of every unit flow.
   */
  cost: number
}

export interface IMcmfContext {
  /**
   * The number of valid edges.
   *
   * In order to save space, there is not recreate a new array at each `init()` called, so this
   * field is used to record the actual effective array length.
   */
  edgeTot: number
  /**
   *
   */
  dist: number[]
  /**
   * Graph edges.
   */
  edges: ReadonlyArray<IMcmfEdge>
  /**
   * Adjacency list. G[i] represent the index list of the  edges start from node i.
   */
  G: ReadonlyArray<ReadonlyArray<number>>
}

export interface IMcmf {
  /**
   * Initialize the mcmf algorithm.
   * @param source  the source node
   * @param target  the target node
   * @param n       the number of nodes
   */
  init(source: number, target: number, n: number): void

  /**
   * Add an edge into the residual network.
   * @param from    the starting node
   * @param to      the ending node
   * @param cap     capacity
   * @param cost    unit price of flow
   */
  addEdge(from: number, to: number, cap: number, cost: number): void

  /**
   * Calculate the min cost and max flow of the residual network.
   * @returns [minCost, maxFlow]
   */
  minCostMaxFlow(): [number, number]

  /**
   * A hook to support access to mcmf internal variables: it accepts a callback
   * function, and when it is executed, part of the internal variables of mcmf
   * will be passed into the callback function as parameters.
   * @param fn
   */
  solve(fn: (context: IMcmfContext) => void): void
}
