import { permutatation } from '../src'

describe('permutation', () => {
  it('snapshot', () => {
    expect(Array.from(permutatation(3))).toEqual([
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0],
    ])
    expect(Array.from(permutatation(3, 1))).toEqual([
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
    ])
  })

  it('default', () => {
    const N: number = 6
    const T: number = new Array(N).fill(0).reduce((acc, _x, i) => acc * (i + 1), 1)
    const set: Set<string> = new Set()
    const iset: Set<number> = new Set()

    let count: number = 0
    let duplicated: number = 0
    let unexpected: number = 0

    for (const aa of permutatation(N)) {
      iset.clear()
      for (const x of aa) iset.add(x)
      if (iset.size !== N) unexpected += 1
      if (aa.some(x => x < 0 || x >= N)) unexpected += 1

      const s: string = aa.join(',')
      if (set.has(s)) duplicated += 1

      set.add(s)
      count += 1
    }

    expect(duplicated).toBe(0)
    expect(unexpected).toBe(0)
    expect(count).toBe(T)
  })

  it('customize start', () => {
    const N: number = 6
    const T: number = new Array(N).fill(0).reduce((acc, _x, i) => acc * (i + 1), 1)
    const set: Set<string> = new Set()
    const iset: Set<number> = new Set()

    let count: number = 0
    let duplicated: number = 0
    let unexpected: number = 0

    for (const aa of permutatation(N, 1)) {
      iset.clear()
      for (const x of aa) iset.add(x)
      if (iset.size !== N) unexpected += 1
      if (aa.some(x => x < 1 || x > N)) unexpected += 1

      const s: string = aa.join(',')
      if (set.has(s)) duplicated += 1

      set.add(s)
      count += 1
    }

    expect(duplicated).toBe(0)
    expect(unexpected).toBe(0)
    expect(count).toBe(T)
  })

  it('edge case', () => {
    expect(Array.from(permutatation(0)).length).toBe(0)
    expect(Array.from(permutatation(-1)).length).toBe(0)
    expect(Array.from(permutatation(2.2)).length).toBe(0)
  })
})
