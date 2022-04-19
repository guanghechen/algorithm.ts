import type { IEdge, IGraph } from '@algorithm.ts/graph'

export type IBellmanFordEdge = IEdge

export interface IBellmanFordGraph extends IGraph {
  /**
   * The source node. (0-index)
   */
  source: number
}
