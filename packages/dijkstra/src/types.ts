import type { IEdge, IGraph } from '@algorithm.ts/graph'

export type IDijkstraEdge = IEdge

export interface IDijkstraGraph extends IGraph {
  /**
   * The source node. (0-index)
   */
  source: number
}
