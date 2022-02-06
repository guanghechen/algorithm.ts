import { randomInt } from '@algorithm.ts/knuth-shuffle'
import { testOjCodes } from 'jest.setup'
import { createEnhancedFindset, createFindset, createHeuristicFindset } from '../src'

describe('createFindset', function () {
  const MAX_N = 1000
  const findset = createFindset(MAX_N)

  test('basic', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    findset.merge(1, 3)
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).not.toBe(findset.root(3))

    findset.merge(2, 3)
    expect(findset.root(1)).toBe(findset.root(2))
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).toBe(findset.root(3))

    // Duplicate merge.
    findset.merge(1, 2)
    expect(findset.root(1)).toBe(findset.root(2))
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).toBe(findset.root(3))

    for (let i = 4; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    findset.initNode(2)
    findset.initNode(3)
    expect(findset.root(2)).toBe(2)
    expect(findset.root(3)).toBe(3)
  })

  test('out of boundary', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.root(-1)).toThrow(/Out of boundary/)
    expect(() => findset.root(0)).toThrow(/Out of boundary/)
    expect(() => findset.root(MAX_N + 1)).toThrow(/Out of boundary/)

    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.init(0)).toThrow(/Invalid value, expect an integer in the range of/)
    expect(() => findset.init(1)).not.toThrow()
    expect(() => findset.init(MAX_N)).not.toThrow()
    expect(() => findset.init(MAX_N + 1)).toThrow(
      /Invalid value, expect an integer in the range of/,
    )
  })
})

describe('createHeuristicFindset', function () {
  const MAX_N = 1000
  const findset = createHeuristicFindset(MAX_N)

  test('basic', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    findset.merge(1, 3)
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).not.toBe(findset.root(3))

    findset.merge(2, 3)
    expect(findset.root(1)).toBe(findset.root(2))
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).toBe(findset.root(3))

    // Duplicate merge.
    findset.merge(1, 2)
    expect(findset.root(1)).toBe(findset.root(2))
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).toBe(findset.root(3))

    for (let i = 4; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    findset.initNode(2)
    findset.initNode(3)
    expect(findset.root(2)).toBe(2)
    expect(findset.size(2)).toBe(1)
    expect(findset.root(3)).toBe(3)
    expect(findset.size(3)).toBe(1)
  })

  test('out of boundary', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.root(-1)).toThrow(/Out of boundary/)
    expect(() => findset.root(0)).toThrow(/Out of boundary/)
    expect(() => findset.root(MAX_N + 1)).toThrow(/Out of boundary/)

    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.init(0)).toThrow(/Invalid value, expect an integer in the range of/)
    expect(() => findset.init(1)).not.toThrow()
    expect(() => findset.init(MAX_N)).not.toThrow()
    expect(() => findset.init(MAX_N + 1)).toThrow(
      /Invalid value, expect an integer in the range of/,
    )
  })

  test('size', function () {
    findset.init(MAX_N)
    for (let i = 0; i < 100; ++i) {
      const x = randomInt(MAX_N - 1) + 1
      const y = randomInt(MAX_N - 1) + 1
      findset.merge(x, y)
    }

    let count = 0
    for (let i = 1; i <= MAX_N; ++i) {
      if (findset.root(i) === i) count += findset.size(i)
    }
    expect(count).toBe(MAX_N)
  })
})

describe('enhanced-findset', function () {
  const MAX_N = 10
  const findset = createEnhancedFindset(MAX_N)

  test('init', function () {
    findset.init(5)
    for (let x = 1; x <= 5; ++x) {
      expect(Array.from(findset.getSetOf(x)!)).toEqual([x])
    }
    for (let x = 6; x <= 10; ++x) {
      expect(Array.from(findset.getSetOf(x)!)).toEqual([])
    }
  })

  test('merge', function () {
    findset.init(MAX_N)
    findset.merge(2, 3)
    expect(findset.size(2)).toEqual(2)
    expect(findset.size(3)).toEqual(2)
    expect(Array.from(findset.getSetOf(2)!).sort()).toEqual([2, 3])
    expect(Array.from(findset.getSetOf(3)!).sort()).toEqual([2, 3])

    findset.merge(1, 2)
    expect(findset.size(1)).toEqual(3)
    expect(findset.size(2)).toEqual(3)
    expect(Array.from(findset.getSetOf(1)!).sort()).toEqual([1, 2, 3])
    expect(Array.from(findset.getSetOf(2)!).sort()).toEqual([1, 2, 3])

    findset.merge(1, 1)
    expect(findset.size(1)).toEqual(3)
    expect(Array.from(findset.getSetOf(1)!).sort()).toEqual([1, 2, 3])
    expect(Array.from(findset.getSetOf(2)!).sort()).toEqual([1, 2, 3])
  })

  test('out of boundary', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.root(-1)).toThrow(/Out of boundary/)
    expect(() => findset.root(0)).toThrow(/Out of boundary/)
    expect(() => findset.root(MAX_N + 1)).toThrow(/Out of boundary/)

    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.init(0)).toThrow(/Invalid value, expect an integer in the range of/)
    expect(() => findset.init(1)).not.toThrow()
    expect(() => findset.init(MAX_N)).not.toThrow()
    expect(() => findset.init(MAX_N + 1)).toThrow(
      /Invalid value, expect an integer in the range of/,
    )
  })
})

describe('oj', function () {
  // https://leetcode.com/problems/find-all-people-with-secret/
  testOjCodes('leetcode/find-all-people-with-secret', import('./oj/find-all-people-with-secret'))
})
