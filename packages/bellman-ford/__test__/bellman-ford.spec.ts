import { testOjCodes } from 'jest.setup'
import type { IGraph } from '../src'
import { BellmanFord, bellmanFord } from '../src'

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
    const bellmanFord = new BellmanFord()
    const graph: IGraph = {
      N: 4,
      source: 0,
      edges: [
        { to: 1, cost: 1 }, // A-B (1)
        { to: 0, cost: -1 }, // B-A (-1)
        { to: 2, cost: 0.87 }, // B-C (0.87)
        { to: 1, cost: -0.87 }, // C-B (-0.87)
        { to: 3, cost: 5 }, // C-D (5)
        { to: 3, cost: 5 }, // D-C (-5)
      ],
      G: [[0], [1, 2], [3, 4], [5]],
    }

    const noNegativeCycle: boolean = bellmanFord.bellmanFord(graph, undefined, context => {
      const a2aPath: number[] = context.getShortestPathTo(0)
      const a2bPath: number[] = context.getShortestPathTo(1)
      const a2cPath: number[] = context.getShortestPathTo(2)
      const a2dPath: number[] = context.getShortestPathTo(3)

      expect(a2aPath).toEqual([0])
      expect(a2bPath).toEqual([0, 1])
      expect(a2cPath).toEqual([0, 1, 2])
      expect(a2dPath).toEqual([0, 1, 2, 3])
    })
    expect(noNegativeCycle).toEqual(true)
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
