import { randomInt } from '@algorithm.ts/shuffle'
import type { IHeuristicFindset } from '../src'
import { HeuristicFindset } from '../src'

const MAX_N = 1000

describe('HeuristicFindset', () => {
  let findset: IHeuristicFindset

  beforeEach(() => {
    findset = new HeuristicFindset()
    findset.init(MAX_N)
  })

  afterEach(() => {
    findset.destroy()
  })

  it('size', () => {
    expect(findset.size).toEqual(1000)

    findset.init(100)
    expect(findset.size).toEqual(100)

    findset.destroy()
    expect(findset.size).toEqual(0)
  })

  it('root', () => {
    expect(findset.root(-1)).toEqual(-1)
    expect(findset.count(-1)).toEqual(0)
    expect(findset.root(0)).toEqual(0)
    expect(findset.count(0)).toEqual(0)

    for (let x = 1; x <= MAX_N; ++x) {
      expect(findset.root(x)).toEqual(x)
      expect(findset.count(x)).toEqual(1)
    }

    expect(findset.root(MAX_N + 1)).toEqual(MAX_N + 1)
    expect(findset.count(MAX_N + 1)).toEqual(0)
  })

  it('destroy', () => {
    expect(findset.destroyed).toBe(false)

    findset.destroy()
    expect(findset.destroyed).toBe(true)

    findset.destroy()
    expect(findset.destroyed).toBe(true)

    expect(() => findset.init(20)).toThrow(
      '[HeuristicFindset] `init` is not allowed since it has been destroyed',
    )
  })

  it('init', () => {
    expect(() => findset.init(-1)).toThrow(
      '[HeuristicFindset] size is expected to be a positive integer, but got (-1).',
    )
    expect(() => findset.init(0)).toThrow(
      '[HeuristicFindset] size is expected to be a positive integer, but got (0).',
    )
    expect(() => findset.init(1.2)).toThrow(
      '[HeuristicFindset] size is expected to be a positive integer, but got (1.2).',
    )
    expect(() => findset.init(1.0)).not.toThrow()
    expect(() => findset.init(2)).not.toThrow()
  })

  it('merge', () => {
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
    for (let i = 4; i <= MAX_N; i += 2) findset.merge(4, i)
    for (let i = 5; i <= MAX_N; i += 2) findset.merge(5, i)

    const r4: number = findset.root(4)
    const r5: number = findset.root(5)
    expect(findset.count(4)).toEqual(findset.count(r4))
    expect(findset.count(4)).toEqual((MAX_N >> 1) - 1)
    expect(findset.count(5)).toEqual(findset.count(r5))
    expect(findset.count(5)).toEqual((MAX_N >> 1) - 2)

    for (let i = 4; i <= MAX_N; ++i) {
      expect(findset.root(i)).toEqual((i & 1) === 0 ? r4 : r5)
    }

    expect(findset.count(4)).toEqual(findset.count(r4))
    expect(findset.count(4)).toEqual((MAX_N >> 1) - 1)
    expect(findset.count(5)).toEqual(findset.count(r5))
    expect(findset.count(5)).toEqual((MAX_N >> 1) - 2)
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
