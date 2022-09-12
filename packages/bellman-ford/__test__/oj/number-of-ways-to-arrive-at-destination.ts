import type { IBellmanFordEdge, IBellmanFordGraph } from '../../src'
import { bellmanFord } from '../../src'

export default countPaths

const MOD = 1e9 + 7
export function countPaths(N: number, roads: number[][]): number {
  const edges: Array<IBellmanFordEdge<number>> = []
  const G: number[][] = new Array(N)
  for (let i = 0; i < N; ++i) G[i] = []
  for (const [from, to, cost] of roads) {
    G[from].push(edges.length)
    edges.push({ to, cost })

    G[to].push(edges.length)
    edges.push({ to: from, cost })
  }

  const source = 0
  const target = N - 1
  const graph: IBellmanFordGraph<number> = { N, source: target, edges, G }
  const result = bellmanFord(graph, { INF: 1e12 })
  if (result.hasNegativeCycle) return -1

  const { dist } = result
  const dp: number[] = new Array(N).fill(-1)
  return dfs(source)

  function dfs(o: number): number {
    if (o === target) return 1

    let answer = dp[o]
    if (answer !== -1) return answer

    answer = 0
    const d = dist[o]
    for (const idx of G[o]) {
      const e: IBellmanFordEdge<number> = edges[idx]
      if (dist[e.to] + e.cost === d) {
        const t = dfs(e.to)
        answer = modAdd(answer, t)
      }
    }
    dp[o] = answer
    return answer
  }
}

function modAdd(x: number, y: number): number {
  const z: number = x + y
  return z < MOD ? z : z - MOD
}
