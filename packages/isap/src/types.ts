/**
 * 残量网络中的一条弧
 * An arc in the residual network.
 */
export interface IsapEdge {
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

/**
 * ISAP 上下文
 */
export interface IsapContext {
  /**
   *
   */
  edgeTot: number
  /**
   *
   */
  cnt: number[]
  /**
   *
   */
  dist: number[]
  /**
   *
   */
  edges: IsapEdge[]
  /**
   *
   */
  G: number[][]
}

export interface Isap {
  /**
   * Initialize the isap algorithm.
   * @param source  the source node
   * @param target  the target node
   * @param n       the number of nodes
   * @param m       the number of edges
   */
  init(source: number, target: number, n: number, m: number): void

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
  maxflow(): number

  /**
   * A hook to support access to isap internal variables: it accepts a callback
   * function, and when it is executed, part of the internal variables of isap
   * will be passed into the callback function as parameters.
   * @param fn
   */
  solve(fn: (context: IsapContext) => void): void
}
