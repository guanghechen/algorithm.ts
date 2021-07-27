import type { DLX } from '@algorithm.ts/dlx'
import { createDLX } from '@algorithm.ts/dlx'
import { createSegmentCodeMap } from './util'

/**
 * Sudoku constraints.
 */
export enum SudokuConstraint {
  // Slot(a, b) 表示第 a 列和第 b 列的格子上要有字母
  SLOT = 0,

  // Row(a, b) 表示第 a 行要有字母 b
  ROW = 1,

  // Col(a, b) 表示第 a 列要有字母 b
  COL = 2,

  // Sub(a, b) 表示第 a 个子方阵要有字母 b
  SUB = 3,
}

export interface SudokuSolverOptions {
  /**
   * Size of the child puzzle matrix (sqrt of original puzzle size)
   */
  readonly childMatrixSize: number
}

export class SudokuSolver {
  public readonly SUDOKU_SIZE_SQRT: number
  public readonly SUDOKU_SIZE: number
  public readonly SUDOKU_SIZE_SQUARE: number
  public readonly DL_TOTAL_COLUMNS: number
  protected readonly constraints: number[] = new Array<number>(4)
  protected readonly segmentCodeMap: ReadonlyArray<number>
  protected readonly dlx: DLX

  constructor(options: SudokuSolverOptions) {
    const { childMatrixSize } = options
    const SUDOKU_SIZE_SQRT = childMatrixSize
    const SUDOKU_SIZE = SUDOKU_SIZE_SQRT * SUDOKU_SIZE_SQRT
    const SUDOKU_SIZE_SQUARE = SUDOKU_SIZE * SUDOKU_SIZE

    const DL_TOTAL_COLUMNS = SUDOKU_SIZE * SUDOKU_SIZE * 4
    const DL_MAX_ROWS = SUDOKU_SIZE * SUDOKU_SIZE * SUDOKU_SIZE
    const DL_MAX_NODES = DL_TOTAL_COLUMNS * DL_MAX_ROWS + SUDOKU_SIZE + 1
    const dlx = createDLX(DL_MAX_NODES)

    this.dlx = dlx
    this.SUDOKU_SIZE_SQRT = SUDOKU_SIZE_SQRT
    this.SUDOKU_SIZE = SUDOKU_SIZE
    this.SUDOKU_SIZE_SQUARE = SUDOKU_SIZE_SQUARE
    this.DL_TOTAL_COLUMNS = DL_TOTAL_COLUMNS
    this.segmentCodeMap = createSegmentCodeMap(SUDOKU_SIZE_SQRT)
  }

  /**
   * Try to solve the given Sudoku problem, if there is a solution, fill the
   * solution into the incoming `solution` board.
   *
   * In particular, you can use the same two-dimensional array to pass in as the
   * `puzzle` and `solution` parameters respectively. If there is a solution,
   * the solution will still be filled into the passed `solution` array.
   *
   * If the `solution` parameter is not passed in, the solution will be
   * discarded, which is equivalent to only judging whether there is a solution.
   *
   * @param puzzle
   * @param solution
   * @returns Whether there is a solution
   * @public
   */
  public solve(
    puzzle: ReadonlyArray<number[]>,
    solution: number[][] | null,
  ): boolean {
    const {
      SUDOKU_SIZE_SQRT,
      SUDOKU_SIZE,
      SUDOKU_SIZE_SQUARE,
      DL_TOTAL_COLUMNS: SUDOKU_NODES,
      constraints,
      segmentCodeMap,
      dlx,
    } = this

    const encode = (a: number, b: number, c: number): number =>
      a * SUDOKU_SIZE_SQUARE + b * SUDOKU_SIZE + c + 1

    dlx.init(SUDOKU_NODES)
    for (let r = 0; r < SUDOKU_SIZE; ++r) {
      for (let c = 0; c < SUDOKU_SIZE; ++c) {
        // (r,c) 所属的子方阵编号
        const s = segmentCodeMap[r] * SUDOKU_SIZE_SQRT + segmentCodeMap[c]
        const w = puzzle[r][c]
        for (let v = 0; v < SUDOKU_SIZE; ++v) {
          if (w === -1 || w === v) {
            constraints[0] = encode(SudokuConstraint.SLOT, r, c)
            constraints[1] = encode(SudokuConstraint.ROW, r, v)
            constraints[2] = encode(SudokuConstraint.COL, c, v)
            constraints[3] = encode(SudokuConstraint.SUB, s, v)
            dlx.addRow(encode(r, c, v), constraints)
          }
        }
      }
    }

    const answer: number[] | null = dlx.solve()
    if (answer === null) return false

    // Fill solution into the `solution` array.
    if (solution !== null) {
      for (const _code of answer) {
        let code = _code - 1
        const c = code % SUDOKU_SIZE

        code = (code / SUDOKU_SIZE) >> 0 // Math.floor
        const b = code % SUDOKU_SIZE

        code = (code / SUDOKU_SIZE) >> 0 // Math.floor
        const a = code

        // eslint-disable-next-line no-param-reassign
        solution[a][b] = c
      }
    }
    return true
  }
}
