import { runInNewContext } from 'node:vm'
import { DancingLinkX } from '../src'
import multipleSudoku3x3 from './fixtures/sudoku9x9/multiple.json'
import uniqueSudoku3x3 from './fixtures/sudoku9x9/unique.json'
import { solveSudoku } from './sudoku9x9'

describe('dlx', () => {
  it('returns the same unique cover on consecutive solves', () => {
    const dlx = new DancingLinkX({ MAX_N: 8 })
    dlx.init(1)
    dlx.addRow(7, [1])

    expect(dlx.solve()).toEqual([7])
    expect(dlx.solve()).toEqual([7])
  })

  it('restores the matrix after failed branches and after finding a cover', () => {
    const dlx = new DancingLinkX({ MAX_N: 16 })
    dlx.init(3)
    dlx.addRow(10, [1, 2])
    dlx.addRow(20, [1, 3])
    dlx.addRow(30, [2, 3])
    expect(dlx.solve()).toBeNull()

    dlx.addRow(40, [2])
    expect(dlx.solve()).toEqual([20, 40])
    expect(dlx.solve()).toEqual([20, 40])

    dlx.addRow(50, [3])
    expect(dlx.solve()).toEqual([10, 50])
  })

  it.each([
    { columnCount: 0, rows: [], expected: [] },
    { columnCount: 1, rows: [], expected: null },
    { columnCount: 3, rows: [[1, 2], [3]], expected: [1, 2] },
  ])('ignores empty rows with $columnCount columns', ({ columnCount, rows, expected }) => {
    const dlx = new DancingLinkX({ MAX_N: 16 })
    dlx.init(columnCount)
    dlx.addRow(100, [])
    for (const [index, columns] of rows.entries()) {
      dlx.addRow(index + 1, columns)
      dlx.addRow(101 + index, [])
    }
    expect(runInNewContext('dlx.solve()', { dlx }, { timeout: 1000 })).toEqual(expected)
  })

  describe('sudoku9x9', () => {
    it('unique solution', () => {
      const solution: number[][] = new Array(9)
      for (let r = 0; r < 9; ++r) solution[r] = new Array(9)

      for (const { puzzle, solution: _solution } of uniqueSudoku3x3) {
        expect(solveSudoku(puzzle, solution)).toBe(true)
        expect(solution).toEqual(_solution)
      }
    })

    it('multiple solution', () => {
      const solution: number[][] = new Array(9)
      for (let r = 0; r < 9; ++r) solution[r] = new Array(9)

      for (const { puzzle } of multipleSudoku3x3) {
        expect(solveSudoku(puzzle, solution)).toBe(true)
        expect(checkSudoku(solution, 3)).toBe(true)
      }
    })

    it('no solution', () => {
      const solution: number[][] = new Array(9)
      for (let r = 0; r < 9; ++r) solution[r] = new Array(9)

      for (const { puzzle } of uniqueSudoku3x3) {
        puzzle[0][0] = 2
        puzzle[0][1] = 2
        expect(solveSudoku(puzzle, solution)).toBe(false)
      }
    })
  })

  it('destroy', () => {
    const dlx = new DancingLinkX({ MAX_N: 10 })
    dlx.init(10)

    expect(dlx.destroyed).toBe(false)
    dlx.destroy()
    expect(dlx.destroyed).toBe(true)

    dlx.destroy()
    expect(dlx.destroyed).toBe(true)

    expect(() => dlx.init(10)).toThrow(
      '[DancingLink] `init` is not allowed since it has been destroyed',
    )

    expect(dlx.solve()).toEqual(null)
  })
})

function checkSudoku(board: number[][], sqrtSize: number): boolean {
  const size: number = sqrtSize * sqrtSize
  const nums: number[] = new Array(size)

  // Check rows
  for (let r = 0; r < size; ++r) {
    nums.fill(0)
    for (let c = 0; c < size; ++c) {
      const w = board[r][c]
      if (w === -1 || nums[w]) return false
      nums[w] = 1
    }
  }

  // Check columns
  for (let c = 0; c < size; ++c) {
    nums.fill(0)
    for (let r = 0; r < size; ++r) {
      const w = board[r][c]
      if (w === -1 || nums[w]) return false
      nums[w] = 1
    }
  }

  // Check sub-child matrix
  for (let x = 0; x < sqrtSize; ++x) {
    for (let y = 0; y < sqrtSize; ++y) {
      nums.fill(0)
      for (let a = 0; a < sqrtSize; ++a) {
        const r = x * 3 + a
        for (let b = 0; b < sqrtSize; ++b) {
          const c = y * 3 + b
          const w = board[r][c]
          if (w === -1 || nums[w]) return false
          nums[w] = 1
        }
      }
    }
  }
  return true
}
