import { buildEdgeMap } from '@algorithm.ts/graph'
import { testOjCodes } from 'jest.setup'
import type { IDijkstraGraph } from '../src'
import dijkstra, { Dijkstra } from '../src'

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

describe('oj', function () {
  // https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/
  testOjCodes(
    'leetcode/number-of-ways-to-arrive-at-destination',
    import('./oj/number-of-ways-to-arrive-at-destination'),
  )

  // https://leetcode.com/problems/maximum-path-quality-of-a-graph/
  testOjCodes(
    'leetcode/maximum-path-quality-of-a-graph',
    import('./oj/maximum-path-quality-of-a-graph'),
  )
})

describe('shortest path', function () {
  test('without negative cycle', function () {
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

    const graph: IDijkstraGraph = {
      N,
      source: Nodes.A,
      edges,
      G: buildEdgeMap(N, edges),
    }

    let a2aPath: number[] | undefined
    let a2bPath: number[] | undefined
    let a2cPath: number[] | undefined
    let a2dPath: number[] | undefined

    const _dijkstra = new Dijkstra()
    const noNegativeCycle: boolean = _dijkstra.dijkstra(graph, undefined, context => {
      a2aPath = context.getShortestPathTo(Nodes.A)
      a2bPath = context.getShortestPathTo(Nodes.B)
      a2cPath = context.getShortestPathTo(Nodes.C)
      a2dPath = context.getShortestPathTo(Nodes.D)
    })

    expect(noNegativeCycle).toEqual(true)
    expect(a2aPath).toEqual([Nodes.A])
    expect(a2bPath).toEqual([Nodes.A, Nodes.B])
    expect(a2cPath).toEqual([Nodes.A, Nodes.B, Nodes.C])
    expect(a2dPath).toEqual([Nodes.A, Nodes.B, Nodes.C, Nodes.D])
  })

  test('with negative cycle', function () {
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
      { from: Nodes.B, to: Nodes.D, cost: -1 },
      { from: Nodes.C, to: Nodes.B, cost: -0.87 },
      { from: Nodes.C, to: Nodes.D, cost: 5 },
      { from: Nodes.D, to: Nodes.C, cost: -5 },
      { from: Nodes.D, to: Nodes.B, cost: 1 },
    ]

    const graph: IDijkstraGraph = {
      N,
      source: Nodes.A,
      edges,
      G: buildEdgeMap(N, edges),
    }

    const _dijkstra = new Dijkstra()
    const noNegativeCycle: boolean = _dijkstra.dijkstra(graph)
    expect(noNegativeCycle).toEqual(false)
  })
})
