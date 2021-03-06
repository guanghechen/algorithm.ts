import type { ISudokuBoard } from './types'

/**
 * Create a sudoku board (two-dimensional array).
 * @param SUDOKU_SIZE
 */
export function createSudokuBoard(SUDOKU_SIZE: number): ISudokuBoard {
  const board: ISudokuBoard = new Array(SUDOKU_SIZE)
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
  board: ISudokuBoard,
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
  src: Readonly<ISudokuBoard>,
  dst: ISudokuBoard,
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
/* istanbul ignore next */
export function checkSudokuSolution(solution: ISudokuBoard, SUDOKU_SIZE_SQRT: number): boolean {
  const SUDOKU_SIZE: number = SUDOKU_SIZE_SQRT * SUDOKU_SIZE_SQRT
  const nums: number[] = new Array(SUDOKU_SIZE)
  let target = 0

  // Check rows
  for (let r = 0; r < SUDOKU_SIZE; ++r, ++target) {
    for (let c = 0; c < SUDOKU_SIZE; ++c) {
      const w = solution[r][c]
      if (w === -1 || nums[w] === target) return false
      nums[w] = target
    }
  }

  // Check columns
  for (let c = 0; c < SUDOKU_SIZE; ++c, ++target) {
    for (let r = 0; r < SUDOKU_SIZE; ++r) {
      const w = solution[r][c]
      if (w === -1 || nums[w] === target) return false
      nums[w] = target
    }
  }

  // Check sub-child matrix
  for (let x = 0; x < SUDOKU_SIZE_SQRT; ++x) {
    for (let y = 0; y < SUDOKU_SIZE_SQRT; ++y, ++target) {
      for (let a = 0; a < SUDOKU_SIZE_SQRT; ++a) {
        const r = x * SUDOKU_SIZE_SQRT + a
        for (let b = 0; b < SUDOKU_SIZE_SQRT; ++b) {
          const c = y * SUDOKU_SIZE_SQRT + b
          const w = solution[r][c]
          if (w === -1 || nums[w] === target) return false
          nums[w] = target
        }
      }
    }
  }
  return true
}

/**
 * segmentCodeMap ?????????????????????????????????????????????????????????????????????????????????????????????
 * ????????????????????????????????????????????????????????????????????????
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
