/**
 * 残量网络中的一条弧
 * An arc in the residual network.
 */
export interface DinicEdge {
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
}

export interface DinicContext {
  /**
   *
   */
  edgeTot: number
  /**
   *
   */
  dist: number[]
  /**
   *
   */
  edges: DinicEdge[]
  /**
   *
   */
  G: number[][]
}

export interface Dinic {
  /**
   * Initialize the dinic algorithm.
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
   */
  addEdge(from: number, to: number, cap: number): void

  /**
   * Calculate the max flow of the residual network.
   */
  maxFlow(): number

  /**
   * A hook to support access to dinic internal variables: it accepts a callback
   * function, and when it is executed, part of the internal variables of dinic
   * will be passed into the callback function as parameters.
   * @param fn
   */
  solve(fn: (context: DinicContext) => void): void
}
