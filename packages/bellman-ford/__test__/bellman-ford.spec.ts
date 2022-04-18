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
