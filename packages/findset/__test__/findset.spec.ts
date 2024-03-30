import type { IFindset } from '../src'
import { Findset } from '../src'

const MAX_N = 1000

describe('Findset', () => {
  let findset: IFindset

  beforeEach(() => {
    findset = new Findset()
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
    expect(findset.root(0)).toEqual(0)
    for (let x = 1; x <= MAX_N; ++x) expect(findset.root(x)).toEqual(x)
    expect(findset.root(MAX_N + 1)).toEqual(MAX_N + 1)
  })

  it('destroy', () => {
    expect(findset.destroyed).toBe(false)

    findset.destroy()
    expect(findset.destroyed).toBe(true)

    findset.destroy()
    expect(findset.destroyed).toBe(true)

    expect(() => findset.init(20)).toThrow(
      '[Findset] `init` is not allowed since it has been destroyed',
    )
  })

  it('init', () => {
    expect(() => findset.init(-1)).toThrow(
      '[Findset] size is expected to be a positive integer, but got (-1).',
    )
    expect(() => findset.init(0)).toThrow(
      '[Findset] size is expected to be a positive integer, but got (0).',
    )
    expect(() => findset.init(1.2)).toThrow(
      '[Findset] size is expected to be a positive integer, but got (1.2).',
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
    for (let i = 4; i <= MAX_N; ++i) expect(findset.root(i)).toEqual((i & 1) === 0 ? r4 : r5)
  })
})
