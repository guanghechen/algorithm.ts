/**
 * Sudoku game board.
 */
export type SudokuBoard = number[][]

/**
 * A sudoku game data.
 */
export interface SudokuData {
  /**
   * Sudoku puzzle.
   */
  puzzle: SudokuBoard
  /**
   * Solution of the sudoku puzzle.
   */
  solution: SudokuBoard
}
