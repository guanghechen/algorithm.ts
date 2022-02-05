import type { IEdge } from '../../src'
import { dijkstra } from '../../src'

export function maximalPathQuality(
  values: number[],
  originalEdges: number[][],
  maxTime: number,
): number {
  const T: number = maxTime
  const N: number = values.length

  const edges: IEdge[] = new Array(N)
  const G: number[][] = new Array(N)
  for (let i = 0; i < N; ++i) G[i] = []
  for (const [u, v, w] of originalEdges) {
    const cost = BigInt(w)
    G[u].push(edges.length)
    edges.push({ to: v, cost })

    G[v].push(edges.length)
    edges.push({ to: u, cost })
  }

  const dist: bigint[] = dijkstra({ N, source: 0, edges, G }, { INF: BigInt(1e12) })

  const visited: Uint8Array = new Uint8Array(N)
  return dfs(0, BigInt(T), values[0])

  function dfs(o: number, t: bigint, acc: number): number {
    const g = G[o]
    const s0: number = visited[o]
    let result = acc

    for (let i = 0; i < g.length; ++i) {
      if (s0 & (1 << i)) continue

      const e = edges[g[i]]
      if (e.cost + dist[e.to] > t) continue

      visited[o] = s0 | (1 << i)
      result = Math.max(result, dfs(e.to, t - e.cost, acc + (visited[e.to] ? 0 : values[e.to])))
      visited[o] = s0
    }
    return result
  }
}
