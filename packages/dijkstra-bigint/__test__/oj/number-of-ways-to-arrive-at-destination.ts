import type { IEdge } from '../../src'
import { dijkstra } from '../../src'

const MOD = BigInt(1e9 + 7)
export function countPaths(N: number, roads: number[][]): number {
  const edges: IEdge[] = []
  const G: number[][] = new Array(N)
  for (let i = 0; i < N; ++i) G[i] = []
  for (const [from, to, _cost] of roads) {
    const cost = BigInt(_cost)

    G[from].push(edges.length)
    edges.push({ to, cost })

    G[to].push(edges.length)
    edges.push({ to: from, cost })
  }

  const source = 0
  const target = N - 1
  const dist: bigint[] = dijkstra({ N, source: target, edges, G }, { INF: BigInt(1e12) })

  const dp: bigint[] = new Array(N).fill(-1n)
  const result: bigint = dfs(source)
  return Number(result)

  function dfs(o: number): bigint {
    if (o === target) return 1n

    let answer = dp[o]
    if (answer !== -1n) return answer

    answer = 0n
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

function modAdd(x: bigint, y: bigint): bigint {
  const z: bigint = x + y
  return z < MOD ? z : z - MOD
}
