import { testOjCodes } from 'jest.setup'
import type { IGraph } from '../src'
import { bellmanFord } from '../src'

describe('basic', function () {
  test('no negative cycle', function () {
    const graph: IGraph = {
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
    const dist: number[] = []

    expect(bellmanFord(graph, { dist })).toEqual(true)
    expect(dist.slice(0, graph.N)).toEqual([0, 2, 4, 4])
  })

  test('negative cycle', function () {
    const dist: number[] = []
    const graph: IGraph = {
      N: 4,
      source: 0,
      edges: [
        { to: 1, cost: -2 },
        { to: 0, cost: -2 },
        { to: 3, cost: 2 },
        { to: 3, cost: 1 },
      ],
      G: [[0], [1, 2], [3], []],
    }
    expect(bellmanFord(graph, { dist })).toEqual(false)
  })

  test('shortest path', function () {
    const A = 0
    const B = 1
    const C = 2
    const D = 3

    const graph: IGraph = {
      N: 4,
      source: A,
      edges: [
        // Nodes: [A, B, C, D]
        { to: B, cost: 1 }, // A-B (1)
        { to: A, cost: -1 }, // B-A (-1)
        { to: C, cost: 0.87 }, // B-C (0.87)
        { to: B, cost: -0.87 }, // C-B (-0.87)
        { to: D, cost: 5 }, // C-D (5)
        { to: C, cost: -5 }, // D-C (-5)
      ],
      G: [[0], [1, 2], [3, 4], [5]],
    }

    let a2aPath: number[] | undefined
    let a2bPath: number[] | undefined
    let a2cPath: number[] | undefined
    let a2dPath: number[] | undefined
    const noNegativeCycle: boolean = bellmanFord(graph, undefined, context => {
      a2aPath = context.getShortestPathTo(A)
      a2bPath = context.getShortestPathTo(B)
      a2cPath = context.getShortestPathTo(C)
      a2dPath = context.getShortestPathTo(D)
    })

    expect(noNegativeCycle).toEqual(true)
    expect(a2aPath).toEqual([A])
    expect(a2bPath).toEqual([A, B])
    expect(a2cPath).toEqual([A, B, C])
    expect(a2dPath).toEqual([A, B, C, D])
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
