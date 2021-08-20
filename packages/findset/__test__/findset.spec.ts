import { randomInt } from '@algorithm.ts/knuth-shuffle'
import { createFindSet, createHeuristicFindSet } from '../src'

describe('createFindSet', function () {
  const MAX_N = 1000
  const findset = createFindSet(MAX_N)

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
  })

  test('out of boundary', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.root(-1)).toThrow(/Out of boundary/)
    expect(() => findset.root(0)).toThrow(/Out of boundary/)
    expect(() => findset.root(MAX_N + 1)).toThrow(/Out of boundary/)

    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)
  })
})

describe('createHeuristicFindSet', function () {
  const MAX_N = 1000
  const findset = createHeuristicFindSet(MAX_N)

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
  })

  test('out of boundary', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.root(-1)).toThrow(/Out of boundary/)
    expect(() => findset.root(0)).toThrow(/Out of boundary/)
    expect(() => findset.root(MAX_N + 1)).toThrow(/Out of boundary/)

    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)
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
