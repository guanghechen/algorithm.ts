import type { ISudokuSize } from './types'

export class SudokuSize implements ISudokuSize {
  public readonly BASE_1: number
  public readonly BASE_2: number
  public readonly BASE_3: number
  public readonly BASE_4: number
  public readonly MATRIX_RANK: number
  public readonly MATRIX: number
  public readonly BOARD: number

  constructor(SUDOKU_CHILD_MATRIX_WIDTH: number) {
    const BASE_1: number = SUDOKU_CHILD_MATRIX_WIDTH
    const BASE_2: number = BASE_1 * BASE_1
    const BASE_3: number = BASE_2 * BASE_1
    const BASE_4: number = BASE_3 * BASE_1

    this.MATRIX_RANK = this.BASE_1 = BASE_1
    this.MATRIX = this.BASE_2 = BASE_2
    this.BASE_3 = BASE_3
    this.BOARD = this.BASE_4 = BASE_4
  }
}
