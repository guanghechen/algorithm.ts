import { createPriorityQueue } from '@algorithm.ts/priority-queue'

export interface DijkstraEdge<T extends number | bigint> {
  /**
   * The other end of the edge.
   */
  to: number
  /**
   * The cost of walking along this side.
   */
  cost: T
}

/**
 * The dijkstra algorithm, optimized with priority queue.
 *
 * @param N         the number of nodes in the graph
 * @param source    the source node
 * @param G         edges of the graph. G[i] represent the edge list start from node i.
 * @param ZERO      0 for number, 0n for bigint.
 * @param INF       a big number, such as Number.MAX_SAFE_INTEGER
 * @returns
 *
 * @see https://me.guanghechen.com/post/algorithm/graph/shortest-path/dijkstra
 */
export function dijkstra<T extends number | bigint>(
  N: number,
  source: number,
  G: ReadonlyArray<ReadonlyArray<DijkstraEdge<T>>>,
  ZERO: T,
  INF: T,
): T[] {
  const dist: T[] = new Array(N).fill(INF)
  const Q = createPriorityQueue<{ pos: number; cost: T }>((x, y) => y.cost - x.cost)

  // eslint-disable-next-line no-param-reassign
  dist[source] = ZERO
  Q.enqueue({ pos: source, cost: ZERO })

  while (Q.size() > 0) {
    const { pos, cost } = Q.dequeue()!
    if (dist[pos] < cost) continue
    for (const e of G[pos]) {
      const candidate: T = (dist[pos] as any) + e.cost
      if (dist[e.to] > candidate) {
        // eslint-disable-next-line no-param-reassign
        dist[e.to] = candidate
        Q.enqueue({ pos: e.to, cost: dist[e.to] })
      }
    }
  }
  return dist
}

export default dijkstra
