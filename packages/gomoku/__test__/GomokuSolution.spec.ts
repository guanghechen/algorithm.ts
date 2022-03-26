import { GomokuSolution } from '../src/GomokuSolution'

describe('15x15 -- 3', function () {
  const solution = new GomokuSolution(15, 15, undefined, 3)

  test('pieces.3', async function () {
    const pieces = await import('./fixtures/15x15/pieces.3.json')
    solution.init(pieces.default)
    const [r, c] = solution.minmaxMatch(1)
    expect([
      [4, 4],
      [9, 4],
    ]).toContainEqual([r, c])
  })

  test('pieces.4', async function () {
    const pieces = await import('./fixtures/15x15/pieces.4.json')
    solution.init([])
    for (const { r, c, p } of pieces.default) solution.forward(r, c, p)
    const [r, c] = solution.minmaxMatch(1)
    expect([[-1, -1]]).toContainEqual([r, c])
  })

  test('pieces.5', async function () {
    const pieces = await import('./fixtures/15x15/pieces.5.json')
    solution.init(pieces.default)
    const [r, c] = solution.minmaxMatch(1)
    expect([[7, 7]]).toContainEqual([r, c])
  })

  test('corner case', function () {
    solution.init([])
    const [r, c] = solution.minmaxMatch(0)
    expect([r, c]).toEqual([7, 7])
  })
})

describe('5x5', function () {
  test('edge case', function () {
    const MAX_ROW = 5
    const MAX_COL = 5
    const solution = new GomokuSolution(MAX_ROW, MAX_COL, 100)
    solution.init([])

    let player = 0
    for (let r = 0; r < MAX_ROW; ++r) {
      for (let c = 0; c < MAX_COL; ++c) {
        solution.forward(r, c, player)
        player ^= 1
      }
    }
    expect(solution.minmaxMatch(1)).toEqual([-1, -1])

    solution.rollback(0, 1)
    expect(solution.minmaxMatch(1)).toEqual([0, 1])
  })
})
