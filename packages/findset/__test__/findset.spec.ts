import { randomInt } from '@algorithm.ts/shuffle'
import type { IFindset } from '../src'
import { EnhancedFindset, HeuristicFindset, VanillaFindset } from '../src'

const MAX_N = 1000

describe('VanillaFindset', () => {
  const findset = new VanillaFindset()
  testFindset(findset)
})

describe('HeuristicFindset', () => {
  const findset = new HeuristicFindset()
  testFindset(findset)

  it('count', function () {
    findset.init(MAX_N)
    for (let i = 0; i < 100; ++i) {
      const x = randomInt(MAX_N - 1) + 1
      const y = randomInt(MAX_N - 1) + 1
      findset.merge(x, y)
    }

    let count = 0
    for (let i = 1; i <= MAX_N; ++i) {
      if (findset.root(i) === i) count += findset.count(i)
    }
    expect(count).toEqual(MAX_N)
  })
})

describe('EnhancedFindset', () => {
  const findset = new EnhancedFindset()
  testFindset(findset)

  it('merge', function () {
    findset.init(MAX_N)
    findset.merge(2, 3)
    expect(findset.count(2)).toEqual(2)
    expect(findset.count(3)).toEqual(2)
    expect(Array.from(findset.getSetOf(2)!).sort()).toEqual([2, 3])
    expect(Array.from(findset.getSetOf(3)!).sort()).toEqual([2, 3])

    findset.merge(1, 2)
    expect(findset.count(1)).toEqual(3)
    expect(findset.count(2)).toEqual(3)
    expect(Array.from(findset.getSetOf(1)!).sort()).toEqual([1, 2, 3])
    expect(Array.from(findset.getSetOf(2)!).sort()).toEqual([1, 2, 3])

    findset.merge(1, 1)
    expect(findset.count(1)).toEqual(3)
    expect(Array.from(findset.getSetOf(1)!).sort()).toEqual([1, 2, 3])
    expect(Array.from(findset.getSetOf(2)!).sort()).toEqual([1, 2, 3])
  })

  it('count', function () {
    findset.init(MAX_N)
    for (let i = 0; i < 100; ++i) {
      const x = randomInt(MAX_N - 1) + 1
      const y = randomInt(MAX_N - 1) + 1
      findset.merge(x, y)
    }

    let count = 0
    for (let i = 1; i <= MAX_N; ++i) {
      if (findset.root(i) === i) count += findset.count(i)
    }
    expect(count).toEqual(MAX_N)
  })
})

function testFindset(findset: IFindset): void {
  it('basic', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toEqual(i)

    findset.merge(1, 3)
    expect(findset.root(1)).toEqual(findset.root(3))
    expect(findset.root(1)).not.toEqual(findset.root(2))
    expect(findset.root(2)).not.toEqual(findset.root(3))

    findset.merge(2, 3)
    expect(findset.root(1)).toEqual(findset.root(2))
    expect(findset.root(1)).toEqual(findset.root(3))
    expect(findset.root(2)).toEqual(findset.root(3))

    // Duplicate merge.
    findset.merge(1, 2)
    expect(findset.root(1)).toEqual(findset.root(2))
    expect(findset.root(1)).toEqual(findset.root(3))
    expect(findset.root(2)).toEqual(findset.root(3))

    for (let i = 4; i <= MAX_N; ++i) expect(findset.root(i)).toEqual(i)
  })

  it('out of boundary', function () {
    findset.init(MAX_N)

    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toEqual(i)
    expect(() => findset.root(-1)).toThrow(/x is expected to be a positive integer smaller than/)
    expect(() => findset.root(0)).toThrow(/x is expected to be a positive integer smaller than/)
    expect(() => findset.root(1)).not.toThrow()
    expect(() => findset.root(MAX_N)).not.toThrow()
    expect(() => findset.root(MAX_N + 1)).toThrow(
      /x is expected to be a positive integer smaller than/,
    )

    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toEqual(i)
    expect(() => findset.init(0)).toThrow(/N is expected to be a positive integer, but got/)
    expect(() => findset.init(1)).not.toThrow()
    expect(() => findset.init(MAX_N)).not.toThrow()
    expect(() => findset.init(MAX_N + 1)).not.toThrow()
  })
}
