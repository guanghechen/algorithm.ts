import type { IPriorityQueue } from '@algorithm.ts/queue'
import { PriorityQueue } from '@algorithm.ts/queue'
import type { DeepReadonly } from '@algorithm.ts/types'
import type { IDijkstraEdge, IDijkstraGraph, IDijkstraOptions, IDijkstraResult } from './types'

interface IStateNode<C extends number | bigint> {
  pos: number
  cost: C
}

export interface IDijkstraProps<C extends number | bigint> {
  /**
   * The value represent the zero cost, 0 for number and 0n for bigint.
   */
  ZERO: C
  /**
   * A big number / bigint, representing the unreachable cost.
   */
  INF: C
}

/**
 * The dijkstra algorithm, optimized with priority queue.
 *
 * !!!NOTE dijkstra cannot work with negative cycle.
 *
 * @param graph
 * @param options
 * @see https://me.guanghechen.com/post/algorithm/graph/shortest-path/dijkstra
 */
export class Dijkstra<C extends number | bigint> {
  protected readonly ZERO: C
  protected readonly INF: C
  // An array recording the shortest distance to the source point.
  protected readonly dist: C[]
  // Record the shortest path parent source point to the specified point.
  // For example: bestFrom[x] represents the previous position of x in the shortest path
  //              parent the source point to x.
  protected readonly bestFrom: number[]
  protected readonly done: boolean[]
  protected readonly Q: IPriorityQueue<IStateNode<C>>

  constructor(props: IDijkstraProps<C>) {
    this.ZERO = props.ZERO
    this.INF = props.INF
    this.bestFrom = []
    this.dist = []
    this.done = []
    this.Q = new PriorityQueue<IStateNode<C>>({ compare: (x, y) => x.cost - y.cost })
  }

  public dijkstra(
    graph: DeepReadonly<IDijkstraGraph<C>>,
    options: IDijkstraOptions<C> = {},
  ): IDijkstraResult<C> {
    const { N, source, edges, G } = graph
    const { ZERO, Q, bestFrom, dist, done } = this
    const { INF = this.INF } = options

    dist.length = N
    done.length = N

    dist.fill(INF, 0, N)
    done.fill(false, 0, N)

    Q.init()
    Q.enqueue({ pos: source, cost: ZERO })
    dist[source] = ZERO

    let edge: DeepReadonly<IDijkstraEdge<C>>
    let to: number
    let candidate: C
    while (Q.size > 0) {
      const o = Q.dequeue()!.pos
      if (done[o]) continue
      done[o] = true

      for (let i = 0, g = G[o], _size = g.length; i < _size; ++i) {
        edge = edges[g[i]]
        to = edge.to
        candidate = ((dist[o] as number) + (edge.cost as unknown as number)) as C
        if (dist[to] > candidate) {
          dist[to] = candidate
          bestFrom[to] = o
          Q.enqueue({ pos: to, cost: candidate })
        }
      }
    }
    return { INF, source, bestFrom, dist }
  }
}
