import { knuthShuffle } from '../src'

describe('knuth-shuffle', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    { size: 2, total: 2 },
    { size: 3, total: 6 },
    { size: 4, total: 24 },
    { size: 5, total: 120 },
  ])('produces all $total permutations exactly once', ({ size, total }) => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    const original = Array.from({ length: size }, (_, index) => index)
    let paths: number[][] = [[]]
    for (let remaining = size; remaining > 1; --remaining) {
      const draws = Array.from({ length: remaining }, (_, index) => (index + 0.5) / remaining)
      paths = paths.flatMap(prefix => draws.map(draw => [...prefix, draw]))
    }

    const outcomes = new Set<string>()
    for (const path of paths) {
      for (const draw of path) random.mockReturnValueOnce(draw)
      const shuffled = original.slice()
      knuthShuffle(shuffled)
      outcomes.add(shuffled.join(','))
      expect(shuffled.sort((first, second) => first - second)).toEqual(original)
    }
    expect(outcomes.size).toBe(total)
    expect(random).toHaveBeenCalledTimes(total * (size - 1))
  })

  it.each([
    { start: 1, end: 4, draw: 0, expected: [0, 2, 3, 1, 4] },
    { start: 1, end: 4, draw: 1 - Number.EPSILON, expected: [0, 1, 2, 3, 4] },
    { start: -2, end: 3, draw: 0, expected: [1, 2, 0, 3, 4] },
    { start: 3, end: 8, draw: 0, expected: [0, 1, 2, 4, 3] },
  ])('only shuffles [$start, $end) at draw $draw', ({ start, end, draw, expected }) => {
    vi.spyOn(Math, 'random').mockReturnValue(draw)
    const values = [0, 1, 2, 3, 4]
    knuthShuffle(values, start, end)
    expect(values).toEqual(expected)
  })

  it('does not draw a random number for fewer than two elements', () => {
    const random = vi.spyOn(Math, 'random')
    const values = [0, 1, 2]
    knuthShuffle([])
    knuthShuffle(values, 1, 2)
    knuthShuffle(values, 2, 1)
    expect(random).not.toHaveBeenCalled()
    expect(values).toEqual([0, 1, 2])
  })
})
