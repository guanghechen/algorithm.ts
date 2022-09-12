import type { IDigraphEdge } from '@algorithm.ts/types'

/**
 * An arc (or edge) in the residual network.
 */
export interface IMcmfEdge extends IDigraphEdge {
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
   */
  minCostMaxFlow(): { mincost: number; maxflow: number }
  /**
   * Calculate the minium cut of the residual network.
   */
  mincut(): Array<Readonly<IMcmfEdge>>
}
