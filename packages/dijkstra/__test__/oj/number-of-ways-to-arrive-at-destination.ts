import type { IEdge } from '../../src'
import { dijkstra } from '../../src'

export default countPaths

const MOD = 1e9 + 7
export function countPaths(N: number, roads: number[][]): number {
  const edges: IEdge[] = []
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
  const dist: number[] = dijkstra({ N, source: target, edges, G }, { INF: 1e12 })

  const dp: number[] = new Array(N).fill(-1)
  return dfs(source)

  function dfs(o: number): number {
    if (o === target) return 1

    let answer = dp[o]
    if (answer !== -1) return answer

    answer = 0
    const d = dist[o]
    for (const idx of G[o]) {
      const e: IEdge = edges[idx]
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
