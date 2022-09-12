/**
 * For x^2 \times x^2 sudoku board
 *
 * - BASE_1 = x
 * - BASE_2 = x^2
 * - BASE_3 = x^3
 * - BASE_4 = x^4
 *
 * // alias
 * - MATRIX_RANK = BASE_1 = x
 * - MATRIX = BASE_2 = x^2
 * - BOARD = BASE_4 = x^4
 */
export interface ISudokuSize {
  readonly BASE_1: number
  readonly BASE_2: number
  readonly BASE_3: number
  readonly BASE_4: number
  readonly MATRIX_RANK: number
  readonly MATRIX: number
  readonly BOARD: number
}

/**
 * Sudoku game board.
 */
export type ISudokuBoardData = number[]

/**
 * A sudoku game data.
 */
export interface ISudokuData {
  /**
   * Sudoku puzzle.
   */
  puzzle: ISudokuBoardData
  /**
   * Solution of the sudoku puzzle.
   */
  solution: ISudokuBoardData
}
