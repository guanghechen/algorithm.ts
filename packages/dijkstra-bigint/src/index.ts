import { createPriorityQueue } from '@algorithm.ts/priority-queue'

export interface IEdge {
  /**
   * The other end of the edge.
   */
  to: number
  /**
   * The cost of walking along this side.
   */
  cost: bigint
}

export interface IGraph {
  /**
   * The number of nodes in the graph. (0-index)
   */
  N: number
  /**
   * The source node. (0-index)
   */
  source: number
  /**
   * Graph edges.
   */
  edges: ReadonlyArray<IEdge>
  /**
   * Adjacency list. G[i] represent the index list of the  edges start from node i.
   */
  G: ReadonlyArray<ReadonlyArray<number>>
  /**
   * An array recording the shortest distance to the source point.
   */
  dist?: bigint[]
}

export interface IOptions {
  /**
   * A big number, representing the unreachable cost.
   */
  INF?: bigint
}

const ZERO = 0n
const DEFAULT_INF = BigInt(Math.floor(Number.MAX_SAFE_INTEGER / 2))
const Q = createPriorityQueue<{ pos: number; cost: bigint }>((x, y) => {
  if (x.cost === y.cost) return 0
  return x.cost < y.cost ? 1 : -1
})

/**
 * The dijkstra algorithm (bigint version), optimized with priority queue.
 *
 * @param graph
 * @param options
 * @see https://me.guanghechen.com/post/algorithm/graph/shortest-path/dijkstra
 * @see https://github.com/guanghechen/algorithm.ts/blob/main/packages/dijkstra
 */
export function dijkstra(graph: IGraph, options: IOptions = {}): bigint[] {
  const { N, source, edges, G, dist = [] } = graph
  const { INF = DEFAULT_INF } = options

  if (dist.length < N) dist.length = N

  dist.fill(INF, 0, N)

  Q.init()
  Q.enqueue({ pos: source, cost: ZERO })
  dist[source] = ZERO

  while (Q.size() > 0) {
    const { pos, cost } = Q.dequeue()!
    if (dist[pos] < cost) continue
    for (const idx of G[pos]) {
      const edge: IEdge = edges[idx]
      const candidate: bigint = dist[pos] + edge.cost
      if (dist[edge.to] > candidate) {
        dist[edge.to] = candidate
        Q.enqueue({ pos: edge.to, cost: dist[edge.to] })
      }
    }
  }
  return dist
}

export default dijkstra
