import type { ICircularQueue } from '@algorithm.ts/circular-queue'
import { createCircularQueue } from '@algorithm.ts/circular-queue'
import { getShortestPath } from '@algorithm.ts/graph'
import type { IBellmanFordEdge, IBellmanFordGraph } from './types'

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
  /**
   * Used to check if an element is already in the queue.
   */
  inq?: boolean[]
  /**
   * Record the number of times an element is enqueued,
   * used to check whether there is a negative cycle.
   */
  inqTimes?: number[]
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

export class BellmanFord {
  protected readonly INF: number
  protected readonly ZERO: number
  protected readonly bestFrom: number[]
  protected readonly dist: number[]
  protected readonly inq: boolean[]
  protected readonly inqTimes: number[]
  protected readonly Q: ICircularQueue<number>

  constructor(options: IOptions = {}) {
    this.INF = options.INF ?? Math.floor(Number.MAX_SAFE_INTEGER / 2)
    this.ZERO = 0
    this.bestFrom = options.bestFrom ?? []
    this.dist = options.dist ?? []
    this.inq = options.inq ?? []
    this.inqTimes = options.inqTimes ?? []
    this.Q = createCircularQueue<number>()
  }

  public bellmanFord(
    graph: IBellmanFordGraph,
    options: IOptions = {},
    onResolved?: (context: IContext) => void,
  ): boolean {
    const { ZERO, Q } = this
    const { N, source, edges, G } = graph
    const {
      INF = this.INF,
      bestFrom = this.bestFrom,
      inq = this.inq,
      inqTimes = this.inqTimes,
      dist = this.dist,
    } = options

    bestFrom.length = N
    dist.length = N
    inq.length = N
    inqTimes.length = N

    bestFrom.fill(-1, 0, N)
    dist.fill(INF, 0, N)
    inq.fill(false, 0, N)
    inqTimes.fill(0, 0, N)

    dist[source] = ZERO
    Q.init(N + 1)
    Q.enqueue(source)

    while (Q.size() > 0) {
      const o: number = Q.dequeue()!
      inq[o] = false

      for (let i = 0, g = G[o], _size = g.length; i < _size; ++i) {
        const x: number = g[i]
        const edge: IBellmanFordEdge = edges[x]
        if (dist[edge.to] > dist[o] + edge.cost) {
          dist[edge.to] = dist[o] + edge.cost
          bestFrom[edge.to] = o

          if (!inq[edge.to]) {
            Q.enqueue(edge.to)
            inq[edge.to] = true

            // eslint-disable-next-line no-plusplus
            if (++inqTimes[edge.to] > N) return false
          }
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
