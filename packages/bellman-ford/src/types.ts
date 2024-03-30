import type { IDigraph, IDigraphEdge } from '@algorithm.ts/graph.types'

export interface IBellmanFordEdge<C extends number | bigint> extends IDigraphEdge {
  /**
   * The cost of walking along this side.
   */
  cost: C
}

export interface IBellmanFordGraph<C extends number | bigint>
  extends IDigraph<IBellmanFordEdge<C>> {
  /**
   * The source node. (0-index)
   */
  readonly source: number
}

export interface IBellmanFordProps<C extends number | bigint> {
  /**
   * The value represent the zero cost, 0 for number and 0n for bigint.
   */
  readonly ZERO: C
  /**
   * A big number / bigint, representing the unreachable cost.
   */
  readonly INF: C
}

export interface IBellmanFordOptions<C extends number | bigint> {
  /**
   * A big number / bigint, representing the unreachable cost.
   */
  readonly INF?: C
}

export type IBellmanFordResult<C extends number | bigint> =
  | {
      // There is at least one negative cycle in the graph, so the shortest path is not existed.
      readonly hasNegativeCycle: true
    }
  | {
      readonly hasNegativeCycle: false
      /**
       * A big number, representing the unreachable cost.
       */
      readonly INF: C
      /**
       * Source point
       */
      readonly source: number
      /**
       * Record the shortest path parent source point to the specified point.
       * For example: bestFrom[x] represents the previous position of x in the shortest path
       *              parent the source point to x.
       */
      readonly bestFrom: ReadonlyArray<number>
      /**
       * An array recording the shortest distance to the source point.
       */
      readonly dist: ReadonlyArray<C>
    }
