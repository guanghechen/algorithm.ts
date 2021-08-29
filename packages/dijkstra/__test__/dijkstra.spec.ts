import type { DijkstraEdge } from '../src'
import dijkstra from '../src'

describe('dijkstra', function () {
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

    for (const kase of data) {
      expect(countPaths(kase.input[0], kase.input[1])).toEqual(kase.answer)
    }
  })
})

const MOD = 1e9 + 7
function countPaths(N: number, roads: number[][]): number {
  const G: Array<Array<DijkstraEdge<number>>> = new Array(N)
  for (let i = 0; i < N; ++i) G[i] = []
  for (const road of roads) {
    G[road[0]].push({ to: road[1], cost: road[2] })
    G[road[1]].push({ to: road[0], cost: road[2] })
  }

  const source = 0
  const target = N - 1
  const dist: number[] = dijkstra<number>(N, target, G, 0, 1e12)

  const dp: number[] = new Array(N).fill(-1)
  return dfs(source)

  function dfs(o: number): number {
    if (o === target) return 1

    let answer = dp[o]
    if (answer !== -1) return answer

    answer = 0
    const d = dist[o]
    for (const e of G[o]) {
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
