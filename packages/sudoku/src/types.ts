/**
 * Sudoku game board.
 */
export type SudokuBoard = number[][]

/**
 * A sudoku game data.
 */
export interface SudokuGameData {
  /**
   * Sudoku puzzle.
   */
  puzzle: SudokuBoard
  /**
   * Solution of the sudoku puzzle.
   */
  solution: SudokuBoard
}
