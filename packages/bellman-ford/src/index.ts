import { createCircularQueue } from '@algorithm.ts/circular-queue'

export interface IEdge {
  /**
   * The other end of the edge.
   */
  to: number
  /**
   * The cost of walking along this side.
   */
  cost: number
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
  dist: number[]
}

export interface IOptions {
  /**
   * A big number, representing the unreachable cost.
   */
  INF?: number
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

const ZERO = 0
const DEFAULT_INF = Math.floor(Number.MAX_SAFE_INTEGER / 2)
const Q = createCircularQueue<number>()

/**
 * The bellman-ford algorithm, optimized with queue.
 *
 * @param graph
 * @param options
 */
export function bellmanFord(graph: IGraph, options: IOptions = {}): boolean {
  const { N, source, edges, G, dist } = graph
  const { INF = DEFAULT_INF, inq = [], inqTimes = [] } = options

  if (dist.length < N) dist.length = N
  if (inq.length < N) inq.length = N
  if (inqTimes.length < N) inqTimes.length = N

  dist.fill(INF, 0, N)
  inq.fill(false, 0, N)
  inqTimes.fill(0, 0, N)

  Q.init(N + 1)
  Q.enqueue(source)
  dist[source] = ZERO

  while (Q.size() > 0) {
    const o: number = Q.dequeue()!
    inq[o] = false

    for (const idx of G[o]) {
      const edge: IEdge = edges[idx]
      if (dist[edge.to] > dist[o] + edge.cost) {
        dist[edge.to] = dist[o] + edge.cost
        if (!inq[edge.to]) {
          Q.enqueue(edge.to)
          inq[edge.to] = true

          // eslint-disable-next-line no-plusplus
          if (++inqTimes[edge.to] > N) return false
        }
      }
    }
  }
  return true
}

export default bellmanFord
