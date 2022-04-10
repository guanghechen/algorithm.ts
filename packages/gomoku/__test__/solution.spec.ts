import { GomokuSolution } from '../src'

describe('construction', () => {
  test('default', () => {
    const solution = new GomokuSolution({ MAX_ROW: 15, MAX_COL: 15 })
    expect(solution.MAX_DEPTH_WIDE).toEqual(2)
    expect(solution.MAX_DEPTH_NARROW).toEqual(4)
    expect(solution.MAX_DEPTH_TIGHT).toEqual(8)
    expect(solution.MAX_DEPTH_DEEP).toEqual(16)
    expect(solution.MAX_CANDIDATE_WIDE).toEqual(16)
    expect(solution.MAX_CANDIDATE_NARROW).toEqual(8)
    expect(solution.MAX_CANDIDATE_TIGHT).toEqual(4)
    expect(solution.MAX_CANDIDATE_DEEP).toEqual(1)
    expect(solution.context.MAX_ROW).toEqual(15)
    expect(solution.context.MAX_COL).toEqual(15)
    expect(solution.context.TOTAL_POS).toEqual(15 * 15)
    expect(solution.context.MAX_ADJACENT).toEqual(5)
    expect(solution.context.MAX_DISTANCE_OF_NEIGHBOR).toEqual(2)
  })
})

describe('15x15', function () {
  class Solution extends GomokuSolution {
    constructor() {
      super({
        MAX_ROW: 15,
        MAX_COL: 15,
        MAX_ADJACENT: 5,
        MAX_DISTANCE_OF_NEIGHBOR: 2,
      })
    }
  }

  const solution = new Solution()
  beforeEach(() => {
    solution.init([])
  })

  test('basic', async function () {
    solution.init([])
    solution.forward(7, 7, 0)
    const [r, c] = solution.minimaxSearch(1)
    expect(Math.abs(r - 7)).toBeLessThanOrEqual(2)
    expect(Math.abs(c - 7)).toBeLessThanOrEqual(2)
  })

  test('pieces.0', async function () {
    const pieces = await import('./fixtures/15x15/pieces.0.json')
    solution.init(pieces.default)

    const [r0, c0] = solution.minimaxSearch(0)
    expect([
      [4, 7],
      [8, 7],
    ]).toContainEqual([r0, c0])

    solution.init(pieces.default)
    const [r1, c1] = solution.minimaxSearch(1)
    expect([
      [4, 7],
      [8, 7],
    ]).toContainEqual([r1, c1])
  })

  test('pieces.3', async function () {
    const pieces = await import('./fixtures/15x15/pieces.3.json')
    solution.init(pieces.default)

    const [r0, c0] = solution.minimaxSearch(0)
    expect([[8, 3]]).toContainEqual([r0, c0])

    solution.init(pieces.default)
    const [r1, c1] = solution.minimaxSearch(1)
    expect([
      [4, 4],
      [9, 4],
    ]).toContainEqual([r1, c1])
  })

  test('pieces.4', async function () {
    const pieces = await import('./fixtures/15x15/pieces.4.json')
    solution.init([])
    for (const { r, c, p } of pieces.default) solution.forward(r, c, p)
    expect(solution.state.isFinal()).toEqual(true)
    const [r, c] = solution.minimaxSearch(1)
    expect([[-1, -1]]).toContainEqual([r, c])
  })

  test('pieces.5', async function () {
    const pieces = await import('./fixtures/15x15/pieces.5.json')
    solution.init(pieces.default)
    const [r, c] = solution.minimaxSearch(1)
    expect([
      [5, 10],
      [6, 6],
      [7, 7],
    ]).toContainEqual([r, c])
  })

  test('pieces.8', async function () {
    const pieces = await import('./fixtures/15x15/pieces.8.json')
    solution.init(pieces.default)
    const [r0, c0] = solution.minimaxSearch(0)
    expect([
      [11, 4],
      [12, 3],
      [12, 10],
      [11, 11],
      [12, 11],
    ]).toContainEqual([r0, c0])

    const [r1, c1] = solution.minimaxSearch(1)
    expect([
      [7, 10],
      [12, 11],
    ]).toContainEqual([r1, c1])
  })

  test('pieces.9', async function () {
    const pieces = await import('./fixtures/15x15/pieces.9.json')
    solution.init(pieces.default)

    const [r0, c0] = solution.minimaxSearch(0)
    expect([
      [7, 6],
      [7, 11],
    ]).toContainEqual([r0, c0])

    const [r1, c1] = solution.minimaxSearch(1)
    expect([
      [6, 6],
      [6, 10],
      [7, 6],
      [7, 11],
    ]).toContainEqual([r1, c1])
  })

  test('pieces.10', async function () {
    const pieces = await import('./fixtures/15x15/pieces.10.json')
    solution.init(pieces.default)
    const [r, c] = solution.minimaxSearch(1)
    expect([r, c]).toEqual([7, 10])
  })

  test('pieces.11', async function () {
    const pieces = await import('./fixtures/15x15/pieces.11.json')
    solution.init(pieces.default)
    const [r, c] = solution.minimaxSearch(0)
    expect([
      [8, 2],
      [8, 4],
    ]).toContainEqual([r, c])

    const [r1, c1] = solution.minimaxSearch(1)
    expect([r1, c1]).toEqual([8, 2])
  })

  test('pieces.12', async function () {
    const pieces = await import('./fixtures/15x15/pieces.12.json')
    solution.init(pieces.default)
    const [r, c] = solution.minimaxSearch(0)
    expect([
      [9, 4],
      [9, 8],
      [10, 4],
      [11, 3],
    ]).toContainEqual([r, c])
  })

  test('pieces.13', async function () {
    const pieces = await import('./fixtures/15x15/pieces.13.json')
    solution.init(pieces.default)
    const [r, c] = solution.minimaxSearch(0)
    expect([
      [10, 5],
      [6, 9],
    ]).toContainEqual([r, c])
  })

  test('pieces.15', async function () {
    const pieces = await import('./fixtures/15x15/pieces.15.json')
    solution.init(pieces.default)
    const [r, c] = solution.minimaxSearch(0)
    expect([[5, 2]]).toContainEqual([r, c])
  })

  test('edge case', function () {
    solution.init([])
    const [r, c] = solution.minimaxSearch(0)
    expect([r, c]).toEqual([7, 7])
  })
})

describe('5x5', function () {
  class Solution extends GomokuSolution {
    constructor(MAX_ADJACENT?: number) {
      super({
        MAX_ROW: 5,
        MAX_COL: 5,
        MAX_ADJACENT,
        MAX_DISTANCE_OF_NEIGHBOR: 2,
      })
    }
  }

  test('edge case', function () {
    const solution = new Solution(100)
    solution.init([])

    let player = 0
    for (let r = 0; r < solution.context.MAX_ROW; ++r) {
      for (let c = 0; c < solution.context.MAX_COL; ++c) {
        solution.forward(r, c, player)
        player ^= 1
      }
    }
    expect(solution.minimaxSearch(1)).toEqual([-1, -1])

    solution.revert(0, 1)
    expect(solution.minimaxSearch(1)).toEqual([0, 1])
  })
})
