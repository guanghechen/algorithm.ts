import { buildEdgeMap, getShortestPath } from '@algorithm.ts/graph'
import type { IDijkstraGraph } from '../src'
import dijkstra, { Dijkstra, dijkstraBigint } from '../src'
import { TestOjDataProblemKey, testOjCodes } from '@@/fixtures/test-util/oj-data'

describe('basic', () => {
  it('dijkstra', () => {
    const graph: IDijkstraGraph<number> = {
      N: 4,
      source: 0,
      edges: [
        { to: 1, cost: 2 },
        { to: 2, cost: 2 },
        { to: 3, cost: 2 },
        { to: 3, cost: 1 },
      ],
      G: [[0], [1, 2], [3], []],
    }

    const result = dijkstra(graph)
    expect(result.dist.slice(0, graph.N)).toEqual([0, 2, 4, 4])
  })

  it.each(['instance', 'function'])('isolates consecutive results through the %s', entry => {
    const solver = new Dijkstra<number>({ ZERO: 0, INF: 100 })
    const run = entry === 'instance' ? solver.dijkstra.bind(solver) : dijkstra
    const first = run({
      N: 4,
      source: 0,
      edges: [
        { to: 1, cost: 2 },
        { to: 2, cost: 3 },
        { to: 3, cost: 4 },
      ],
      G: [[0], [1], [2], []],
    })
    const second = run({ N: 3, source: 2, edges: [], G: [[], [], []] }, { INF: 50 })

    expect(second.dist).toEqual([50, 50, 0])
    expect(second.bestFrom).toEqual([-1, -1, -1])
    expect(first.dist).toEqual([0, 2, 5, 9])
    expect(first.bestFrom).toEqual([-1, 0, 1, 2])
  })

  it('dijkstraBigint', () => {
    const graph: IDijkstraGraph<bigint> = {
      N: 4,
      source: 0,
      edges: [
        { to: 1, cost: 2n },
        { to: 2, cost: 2n },
        { to: 3, cost: 2n },
        { to: 3, cost: 1n },
      ],
      G: [[0], [1, 2], [3], []],
    }

    const result = dijkstraBigint(graph)
    const result2 = dijkstraBigint({ ...graph, source: 3 }, { INF: 99n })
    expect(result2.dist).toEqual([99n, 99n, 99n, 0n])
    expect(result2.bestFrom).toEqual([-1, -1, -1, -1])
    expect(result.dist).toEqual([0n, 2n, 4n, 4n])
    expect(result.bestFrom).toEqual([-1, 0, 1, 1])
  })
})

describe('shortest path', () => {
  it('without negative cycle', () => {
    enum Nodes {
      A = 0,
      B = 1,
      C = 2,
      D = 3,
    }

    const N = 4
    const edges = [
      { from: Nodes.A, to: Nodes.B, cost: 1 },
      { from: Nodes.B, to: Nodes.A, cost: -1 },
      { from: Nodes.B, to: Nodes.C, cost: 0.87 },
      { from: Nodes.C, to: Nodes.B, cost: -0.87 },
      { from: Nodes.C, to: Nodes.D, cost: 5 },
      { from: Nodes.D, to: Nodes.C, cost: -5 },
    ]

    const graph: IDijkstraGraph<number> = {
      N,
      source: Nodes.A,
      edges,
      G: buildEdgeMap(N, edges),
    }

    const _dijkstra = new Dijkstra({
      ZERO: 0,
      INF: Math.floor(Number.MAX_SAFE_INTEGER / 2),
    })
    const { bestFrom } = _dijkstra.dijkstra(graph)
    expect(getShortestPath(bestFrom, Nodes.A, Nodes.A)).toEqual([Nodes.A])
    expect(getShortestPath(bestFrom, Nodes.A, Nodes.B)).toEqual([Nodes.A, Nodes.B])
    expect(getShortestPath(bestFrom, Nodes.A, Nodes.C)).toEqual([Nodes.A, Nodes.B, Nodes.C])
    expect(getShortestPath(bestFrom, Nodes.A, Nodes.D)).toEqual([
      Nodes.A,
      Nodes.B,
      Nodes.C,
      Nodes.D,
    ])
  })
})

describe('oj', () => {
  // https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/
  testOjCodes(
    TestOjDataProblemKey.LEETCODE_NUMBER_OF_WAYS_TO_ARRIVE_AT_DESTINATION,
    import('./oj/number-of-ways-to-arrive-at-destination'),
  )

  // https://leetcode.com/problems/maximum-path-quality-of-a-graph/
  testOjCodes(
    TestOjDataProblemKey.LEETCODE_MAXIMUM_PATH_QUALITY_OF_A_GRAPH,
    import('./oj/maximum-path-quality-of-a-graph'),
  )
})
