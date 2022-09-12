import type { IDancingLinkX } from '@algorithm.ts/dlx'
import { DancingLinkX } from '@algorithm.ts/dlx'
import { SudokuSize } from './size'
import type { ISudokuBoardData, ISudokuSize } from './types'
import { createMatrixCodeMap } from './util'

/**
 * Sudoku constraints.
 */
export const enum SudokuConstraint {
  // Slot(a, b) 表示第 a 列和第 b 列的格子上要有字母
  SLOT = 0,

  // Row(a, b) 表示第 a 行要有字母 b
  ROW = 1,

  // Col(a, b) 表示第 a 列要有字母 b
  COL = 2,

  // Sub(a, b) 表示第 a 个子方阵要有字母 b
  SUB = 3,
}

export interface ISudokuSolverOptions {
  /**
   * Size of the child puzzle matrix (sqrt of original puzzle size)
   */
  readonly childMatrixWidth: number
}

export class SudokuSolver {
  public readonly size: Readonly<ISudokuSize>
  public readonly DL_TOTAL_COLUMNS: number
  protected readonly dlx: IDancingLinkX
  protected readonly matCodeMap: ReadonlyArray<number>
  protected readonly constraints: SudokuConstraint[] = new Array<SudokuConstraint>(4)

  constructor(options: ISudokuSolverOptions) {
    const { childMatrixWidth } = options
    const size = new SudokuSize(childMatrixWidth)
    const DL_TOTAL_COLUMNS = size.BOARD * 4
    const DL_MAX_ROWS = size.BOARD * size.MATRIX
    const DL_MAX_NODES = DL_TOTAL_COLUMNS * DL_MAX_ROWS + size.MATRIX + 1
    const dlx = new DancingLinkX({ MAX_N: DL_MAX_NODES })

    this.size = size
    this.DL_TOTAL_COLUMNS = DL_TOTAL_COLUMNS
    this.dlx = dlx
    this.matCodeMap = createMatrixCodeMap(size)
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
  public solve(puzzle: Readonly<ISudokuBoardData>, solution: ISudokuBoardData | null): boolean {
    const { size, DL_TOTAL_COLUMNS: SUDOKU_NODES, constraints, matCodeMap, dlx } = this
    const { MATRIX, BOARD } = size
    const encode = (constraint: number, code: number): number => constraint * BOARD + code + 1

    dlx.init(SUDOKU_NODES)
    for (let r = 0, id = 0; r < MATRIX; ++r) {
      for (let c = 0; c < MATRIX; ++c, ++id) {
        const w = puzzle[id]
        const matCode: number = matCodeMap[id]
        const lv: number = w === -1 ? 0 : w
        const rv: number = w === -1 ? MATRIX : w + 1
        for (let v = lv; v < rv; ++v) {
          constraints[0] = encode(SudokuConstraint.SLOT, id)
          constraints[1] = encode(SudokuConstraint.ROW, r * MATRIX + v)
          constraints[2] = encode(SudokuConstraint.COL, c * MATRIX + v)
          constraints[3] = encode(SudokuConstraint.SUB, matCode * MATRIX + v)
          const rowNum = id * MATRIX + v + 1
          dlx.addRow(rowNum, constraints)
        }
      }
    }

    const answer: number[] | null = dlx.solve()
    if (answer === null) return false

    // Fill solution into the `solution` array.
    if (solution !== null) {
      for (const _code of answer) {
        const code = _code - 1
        const v = code % MATRIX
        const id = (code / MATRIX) >> 0 // Math.floor

        // eslint-disable-next-line no-param-reassign
        solution[id] = v
      }
    }
    return true
  }
}
