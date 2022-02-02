/**
 * Sudoku game board.
 */
export type ISudokuBoard = number[][]

/**
 * A sudoku game data.
 */
export interface ISudokuData {
  /**
   * Sudoku puzzle.
   */
  puzzle: ISudokuBoard
  /**
   * Solution of the sudoku puzzle.
   */
  solution: ISudokuBoard
}
