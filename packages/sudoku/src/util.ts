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

/**
 * segmentCodeMap 是一个映射表，用于快速计算某个格子所在行在其所在列上的第几个子
 * 方阵中（或者所在列在其所在行上的第几个子方阵中）
 *
 * segmentCodeMap is a mapping table for quickly located the sub-matrix of a grid.
 *
 * For example:
 *
 *    In a 9x9 sudoku board, a grid (x, y) at the sub-matrix
 *    `(Math.floor(x / 3), Math.floor(y / 3))`. If use segmentNo to represent the
 *    position, it is `(segmentNo[x], segmentNo[y])`
 *
 * @param SUDOKU_SIZE
 */
export function createSegmentCodeMap(SUDOKU_SIZE_SQRT: number): number[] {
  const SUDOKU_SIZE = SUDOKU_SIZE_SQRT * SUDOKU_SIZE_SQRT
  const segmentCodeMap: number[] = new Array(SUDOKU_SIZE)
  for (let i = 0, s = 0, j; i < SUDOKU_SIZE; i = j, ++s) {
    j = i + SUDOKU_SIZE_SQRT
    segmentCodeMap.fill(s, i, j)
  }
  return segmentCodeMap
}
