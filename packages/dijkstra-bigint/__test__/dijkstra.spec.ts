import type { IEdge } from '../src'
import dijkstra from '../src'

describe('basic', function () {
  test('simple', function () {
    expect(
      dijkstra({
        N: 4,
        source: 0,
        edges: [
          { to: 1, cost: 2n },
          { to: 2, cost: 2n },
          { to: 3, cost: 2n },
          { to: 3, cost: 1n },
        ],
        G: [[0], [1, 2], [3], []],
      }),
    ).toEqual([0n, 2n, 4n, 4n])
  })
})

describe('leetcode', function () {
  // https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/
  test('leetcode/number-of-ways-to-arrive-at-destination', function () {
    const data: any[] = [
      {
        input: [
          7,
          [
            [0, 6, 7],
            [0, 1, 2],
            [1, 2, 3],
            [1, 3, 3],
            [6, 3, 3],
            [3, 5, 1],
            [6, 5, 1],
            [2, 5, 1],
            [0, 4, 5],
            [4, 6, 2],
          ],
        ],
        answer: 4n,
      },
      {
        input: [2, [[1, 0, 10]]],
        answer: 1n,
      },
    ]

    const customDist: bigint[] = []
    for (const kase of data) {
      const [N, roads] = kase.input

      expect(countPaths(N, roads)).toEqual(kase.answer)
      expect(countPaths(N, roads, customDist)).toEqual(kase.answer)
    }
  })
})

const MOD = BigInt(1e9 + 7)
function countPaths(N: number, roads: number[][], customDist?: bigint[]): bigint {
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
  const dist: bigint[] = dijkstra(
    { N, source: target, edges, G, dist: customDist },
    { INF: BigInt(1e12) },
  )

  const dp: bigint[] = new Array(N).fill(-1n)
  return dfs(source)

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
