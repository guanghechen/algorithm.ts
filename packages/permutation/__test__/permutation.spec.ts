import { permutatation } from '../src'

describe('permutation', () => {
  it('basic', () => {
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
