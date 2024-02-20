import type { IBipartiteMatcher, IBipartiteMatching } from '../src'
import { HungarianBfs, HungarianDfs } from '../src'

function testMatching(matching: IBipartiteMatching, expectCount: number): void {
  const { count, partners } = matching
  expect(count).toEqual(expectCount)

  let total = 0
  for (let i = 0; i < partners.length; ++i) {
    if (partners[i] === -1) continue
    const j = partners[i]
    expect(j).not.toEqual(i)
    expect(partners[j]).toEqual(i)
    total += 1
  }
  expect(count * 2).toEqual(total)
}

function testBipartiteMatching(createMatcher: () => IBipartiteMatcher): void {
  describe('basic', function () {
    it('exceptional', function () {
      const matcher = createMatcher()
      expect(() => matcher.init(0)).toThrow(
        /The number of nodes \(N\) is expected to be a positive integer, but got/,
      )
      expect(() => matcher.init(-1)).toThrow(
        /The number of nodes \(N\) is expected to be a positive integer, but got/,
      )
    })

    it('basic', function () {
      const matcher = createMatcher()
      matcher.init(4)
      expect(matcher.isPerfectMatch()).toEqual(false)
      testMatching(matcher.maxMatch(), 0)

      matcher.addEdge(0, 1)
      matcher.addEdge(0, 2)
      matcher.addEdge(0, 3)
      expect(matcher.isPerfectMatch()).toEqual(false)
      testMatching(matcher.maxMatch(), 1)

      matcher.addEdge(1, 2)
      matcher.addEdge(1, 3)
      matcher.addEdge(2, 3)
      expect(matcher.isPerfectMatch()).toEqual(true)
      testMatching(matcher.maxMatch(), 2)

      matcher.init(4)
      expect(matcher.isPerfectMatch()).toEqual(false)
      testMatching(matcher.maxMatch(), 0)

      matcher.init(4)
      matcher.addEdge(0, 1)
      matcher.addEdge(2, 3)
      expect(matcher.isPerfectMatch()).toEqual(true)
      testMatching(matcher.maxMatch(), 2)

      matcher.init(3)
      matcher.addEdge(0, 1)
      matcher.addEdge(0, 2)
      matcher.addEdge(1, 2)
      expect(matcher.isPerfectMatch()).toEqual(false)
      testMatching(matcher.maxMatch(), 1)
    })
  })
}

describe('HungarianDfs', () => {
  testBipartiteMatching(() => new HungarianDfs())
})

describe('HungarianBfs', () => {
  testBipartiteMatching(() => new HungarianBfs())
})
