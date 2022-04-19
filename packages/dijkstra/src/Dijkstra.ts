import { getShortestPath } from '@algorithm.ts/graph'
import type { IPriorityQueue } from '@algorithm.ts/priority-queue'
import { createPriorityQueue } from '@algorithm.ts/priority-queue'
import type { IDijkstraEdge, IDijkstraGraph } from './types'

export interface IOptions {
  /**
   * A big number, representing the unreachable cost.
   */
  INF?: number
  /**
   * Record the shortest path parent source point to the specified point.
   * For example: bestFrom[x] represents the previous position of x in the shortest path
   *              parent the source point to x.
   */
  bestFrom?: number[]
  /**
   * An array recording the shortest distance to the source point.
   */
  dist?: number[]
}

export interface IContext {
  /**
   * A big number, representing the unreachable cost.
   */
  INF: number
  /**
   * Record the shortest path parent source point to the specified point.
   * For example: bestFrom[x] represents the previous position of x in the shortest path
   *              parent the source point to x.
   */
  bestFrom: ReadonlyArray<number>
  /**
   * An array recording the shortest distance to the source point.
   */
  dist: ReadonlyArray<number>
  /**
   * Get shortest path from the source point to the given target point.
   */
  getShortestPathTo(target: number): number[]
}

/**
 * The dijkstra algorithm, optimized with priority queue.
 *
 * @param graph
 * @param options
 * @see https://me.guanghechen.com/post/algorithm/graph/shortest-path/dijkstra
 */
export class Dijkstra {
  protected readonly INF: number
  protected readonly ZERO: number
  protected readonly bestFrom: number[]
  protected readonly dist: number[]
  protected readonly done: boolean[]
  protected readonly Q: IPriorityQueue<{ pos: number; cost: number }>

  constructor(options: IOptions = {}) {
    this.INF = options.INF ?? Math.floor(Number.MAX_SAFE_INTEGER / 2)
    this.ZERO = 0
    this.bestFrom = options.bestFrom ?? []
    this.dist = options.dist ?? []
    this.done = []
    this.Q = createPriorityQueue<{ pos: number; cost: number }>((x, y) => {
      if (x.cost === y.cost) return 0
      return x.cost < y.cost ? 1 : -1
    })
  }

  public dijkstra(
    graph: IDijkstraGraph,
    options: IOptions = {},
    onResolved?: (context: IContext) => void,
  ): boolean {
    const { ZERO, Q, done } = this
    const { N, source, edges, G } = graph
    const { INF = this.INF, bestFrom = this.bestFrom, dist = this.dist } = options

    dist.length = N
    done.length = N

    dist.fill(INF, 0, N)
    done.fill(false, 0, N)

    Q.init()
    Q.enqueue({ pos: source, cost: ZERO })
    dist[source] = ZERO

    while (Q.size() > 0) {
      const { pos: o, cost } = Q.dequeue()!

      if (done[o]) {
        if (dist[o] < cost) return false
        continue
      }
      done[o] = true

      for (const idx of G[o]) {
        const edge: IDijkstraEdge = edges[idx]
        const candidate: number = dist[o] + edge.cost
        if (dist[edge.to] > candidate) {
          dist[edge.to] = candidate
          bestFrom[edge.to] = o
          Q.enqueue({ pos: edge.to, cost: dist[edge.to] })
        }
      }
    }

    if (onResolved) {
      const getShortestPathTo = (target: number): number[] =>
        getShortestPath(bestFrom, source, target)
      const context: IContext = {
        INF: this.INF,
        bestFrom: this.bestFrom,
        dist: this.dist,
        getShortestPathTo,
      }
      onResolved(context)
    }
    return true
  }
}
