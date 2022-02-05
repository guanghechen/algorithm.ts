import { loadCommonJsonFixtures } from 'jest.setup'
import type { ITestData } from 'jest.setup'
import dijkstra from '../src'
import { maximalPathQuality } from './oj/maximum-path-quality-of-a-graph'
import { countPaths } from './oj/number-of-ways-to-arrive-at-destination'

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
    type IParameters = Parameters<typeof countPaths>
    type IAnswer = ReturnType<typeof countPaths>
    const data: Array<ITestData<IParameters, IAnswer>> = loadCommonJsonFixtures(
      'leetcode/number-of-ways-to-arrive-at-destination',
    )

    for (const { input, answer } of data) expect(countPaths(...input)).toEqual(answer)
  })

  // https://leetcode.com/problems/maximum-path-quality-of-a-graph/
  test('leetcode/maximum-path-quality-of-a-graph', function () {
    type IParameters = Parameters<typeof maximalPathQuality>
    type IAnswer = ReturnType<typeof maximalPathQuality>
    const data: Array<ITestData<IParameters, IAnswer>> = loadCommonJsonFixtures(
      'leetcode/maximum-path-quality-of-a-graph',
    )

    for (const { input, answer } of data) expect(maximalPathQuality(...input)).toEqual(answer)
  })
})
