import type { IEdge } from '../src'
import dijkstra from '../src'

describe('basic', function () {
  test('simple', function () {
    expect(
      dijkstra({
        N: 4,
        source: 0,
        edges: [
          { to: 1, cost: 2 },
          { to: 2, cost: 2 },
          { to: 3, cost: 2 },
          { to: 3, cost: 1 },
        ],
        G: [[0], [1, 2], [3], []],
      }),
    ).toEqual([0, 2, 4, 4])
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
        answer: 4,
      },
      {
        input: [2, [[1, 0, 10]]],
        answer: 1,
      },
    ]

    const customDist: number[] = []
    for (const kase of data) {
      const [N, roads] = kase.input

      expect(countPaths(N, roads)).toEqual(kase.answer)
      expect(countPaths(N, roads, customDist)).toEqual(kase.answer)
    }
  })
})

const MOD = 1e9 + 7
function countPaths(N: number, roads: number[][], customDist?: number[]): number {
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
  const dist: number[] = dijkstra({ N, source: target, edges, G }, 1e12, customDist)

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
