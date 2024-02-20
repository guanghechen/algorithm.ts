import { DancingLinkX } from '../src'
import multipleSudoku3x3 from './fixtures/sudoku9x9/multiple.json'
import uniqueSudoku3x3 from './fixtures/sudoku9x9/unique.json'
import { solveSudoku } from './sudoku9x9'

describe('dlx', function () {
  describe('sudoku9x9', function () {
    it('unique solution', function () {
      const solution: number[][] = new Array(9)
      for (let r = 0; r < 9; ++r) solution[r] = new Array(9)

      for (const { puzzle, solution: _solution } of uniqueSudoku3x3) {
        expect(solveSudoku(puzzle, solution)).toBe(true)
        expect(solution).toEqual(_solution)
      }
    })

    it('multiple solution', function () {
      const solution: number[][] = new Array(9)
      for (let r = 0; r < 9; ++r) solution[r] = new Array(9)

      for (const { puzzle } of multipleSudoku3x3) {
        expect(solveSudoku(puzzle, solution)).toBe(true)
        expect(checkSudoku(solution, 3)).toBe(true)
      }
    })

    it('no solution', function () {
      const solution: number[][] = new Array(9)
      for (let r = 0; r < 9; ++r) solution[r] = new Array(9)

      for (const { puzzle } of uniqueSudoku3x3) {
        puzzle[0][0] = 2
        puzzle[0][1] = 2
        expect(solveSudoku(puzzle, solution)).toBe(false)
      }
    })
  })

  it('destroy', function () {
    const dlx = new DancingLinkX({ MAX_N: 10 })
    dlx.init(10)
    dlx.destroy()
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
