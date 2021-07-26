import type { SudokuBoard } from './types'

/**
 * Create a sudoku board (two-dimensional array).
 * @param SUDOKU_SIZE
 */
export function createSudokuBoard(SUDOKU_SIZE: number): SudokuBoard {
  const board: SudokuBoard = new Array(SUDOKU_SIZE)
  for (let r = 0; r < SUDOKU_SIZE; ++r) {
    board[r] = new Array(SUDOKU_SIZE)
  }
  return board
}

/**
 * Fill the sudoku board with the given value.
 * @param board
 * @param v
 * @param SUDOKU_SIZE
 */
export function fillSudokuBoard(
  board: SudokuBoard,
  v: number,

  SUDOKU_SIZE: number = board.length,
): void {
  for (let r = 0; r < SUDOKU_SIZE; ++r) {
    for (let c = 0; c < SUDOKU_SIZE; ++c) {
      // eslint-disable-next-line no-param-reassign
      board[r][c] = v
    }
  }
}

/**
 * Copy sudoku board from `src` to `dst`.
 * @param src
 * @param dst
 * @param SUDOKU_SIZE
 */
export function copySudokuBoard(
  src: Readonly<SudokuBoard>,
  dst: SudokuBoard,
  SUDOKU_SIZE: number = src.length,
): void {
  for (let r = 0; r < SUDOKU_SIZE; ++r) {
    for (let c = 0; c < SUDOKU_SIZE; ++c) {
      // eslint-disable-next-line no-param-reassign
      dst[r][c] = src[r][c]
    }
  }
}

/**
 * Check if the solution of the given Sudoku game is a valid solution.
 *
 * @param solution
 * @param SUDOKU_SIZE_SQRT
 * @returns
 */
export function checkSudokuSolution(
  solution: SudokuBoard,
  SUDOKU_SIZE_SQRT: number,
): boolean {
  const SUDOKU_SIZE: number = SUDOKU_SIZE_SQRT * SUDOKU_SIZE_SQRT
  const nums: number[] = new Array(SUDOKU_SIZE)

  // Check rows
  for (let r = 0; r < SUDOKU_SIZE; ++r) {
    nums.fill(0)
    for (let c = 0; c < SUDOKU_SIZE; ++c) {
      const w = solution[r][c]
      if (w === -1 || nums[w]) return false
      nums[w] = 1
    }
  }

  // Check columns
  for (let c = 0; c < SUDOKU_SIZE; ++c) {
    nums.fill(0)
    for (let r = 0; r < SUDOKU_SIZE; ++r) {
      const w = solution[r][c]
      if (w === -1 || nums[w]) return false
      nums[w] = 1
    }
  }

  // Check sub-child matrix
  for (let x = 0; x < SUDOKU_SIZE_SQRT; ++x) {
    for (let y = 0; y < SUDOKU_SIZE_SQRT; ++y) {
      nums.fill(0)
      for (let a = 0; a < SUDOKU_SIZE_SQRT; ++a) {
        const r = x * SUDOKU_SIZE_SQRT + a
        for (let b = 0; b < SUDOKU_SIZE_SQRT; ++b) {
          const c = y * SUDOKU_SIZE_SQRT + b
          const w = solution[r][c]
          if (w === -1 || nums[w]) return false
          nums[w] = 1
        }
      }
    }
  }
  return true
}
