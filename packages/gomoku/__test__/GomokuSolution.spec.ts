import { GomokuSolution } from '../src/GomokuSolution'

describe('15x15 -- 3', function () {
  const solution = new GomokuSolution(15, 15, 5, 3)

  test('pieces.3', async function () {
    const pieces = await import('./fixtures/15x15/pieces.3.json')
    solution.init(pieces.default)
    const { r, c } = solution.minmaxMatch(1)
    expect([
      [4, 4],
      [9, 4],
    ]).toContainEqual([r, c])
  })
})
