import type { ICircularQueue } from '@algorithm.ts/queue'
import { CircularQueue } from '@algorithm.ts/queue'
import type { DeepReadonly } from '@algorithm.ts/types'
import type {
  IBellmanFordEdge,
  IBellmanFordGraph,
  IBellmanFordOptions,
  IBellmanFordResult,
} from './types'

export interface IBellmanFordProps<C extends number | bigint> {
  /**
   * The value represent the zero cost, 0 for number and 0n for bigint.
   */
  ZERO: C
  /**
   * A big number / bigint, representing the unreachable cost.
   */
  INF: C
}

export class BellmanFord<C extends number | bigint> {
  protected readonly ZERO: C
  protected readonly INF: C
  // An array recording the shortest distance to the source point.
  protected readonly dist: C[]
  // Record the shortest path parent source point to the specified point.
  // For example: bestFrom[x] represents the previous position of x in the shortest path
  //              parent the source point to x.
  protected readonly bestFrom: number[]
  // Used to check if an element is already in the queue.
  protected readonly inq: boolean[]
  // Record the number of times an element is enqueued,
  // used to check whether there is a negative cycle.
  protected readonly inqTimes: number[]
  protected readonly Q: ICircularQueue<number>

  constructor(props: IBellmanFordProps<C>) {
    this.ZERO = props.ZERO
    this.INF = props.INF
    this.bestFrom = []
    this.dist = []
    this.inq = []
    this.inqTimes = []
    this.Q = new CircularQueue<number>()
  }

  public bellmanFord(
    graph: DeepReadonly<IBellmanFordGraph<C>>,
    options: IBellmanFordOptions<C> = {},
  ): IBellmanFordResult<C> {
    const { N, source, edges, G } = graph
    const { ZERO, Q, bestFrom, dist, inq, inqTimes } = this
    const { INF = this.INF } = options

    bestFrom.length = N
    dist.length = N
    inq.length = N
    inqTimes.length = N

    bestFrom.fill(-1, 0, N)
    dist.fill(INF, 0, N)
    inq.fill(false, 0, N)
    inqTimes.fill(0, 0, N)

    dist[source] = ZERO

    Q.init()
    Q.resize(N + 1)
    Q.enqueue(source)

    let edge: DeepReadonly<IBellmanFordEdge<C>>
    let to: number
    let candidate: C
    while (Q.size > 0) {
      const o: number = Q.dequeue()!
      inq[o] = false

      for (let i = 0, g = G[o], _size = g.length; i < _size; ++i) {
        edge = edges[g[i]]
        to = edge.to
        candidate = ((dist[o] as number) + (edge.cost as unknown as number)) as C
        if (dist[to] > candidate) {
          dist[to] = candidate
          bestFrom[to] = o

          if (!inq[to]) {
            Q.enqueue(to)
            inq[to] = true

            // eslint-disable-next-line no-plusplus
            if (++inqTimes[to] > N) return { hasNegativeCycle: true }
          }
        }
      }
    }
    return { hasNegativeCycle: false, INF, source, bestFrom, dist }
  }
}
