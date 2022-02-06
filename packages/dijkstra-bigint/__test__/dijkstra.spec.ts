import { testOjCodes } from 'jest.setup'
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
