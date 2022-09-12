import { DancingLinkX } from '../src'

const ebs = 1e-6
const DL_TOTAL_COLUMNS = 9 * 9 * 4
const DL_MAX_NODES = DL_TOTAL_COLUMNS * (9 * 9 * 9) + 10
const dlx = new DancingLinkX({ MAX_N: DL_MAX_NODES })

// Sudoku constraints.
export enum SudokuConstraint {
  SLOT = 0, // Slot(a, b): There must be a number on the grid in row a column b
  ROW = 1, // Row(a, b): Row a must have the number b
  COL = 2, // Col(a, b): Column a must have the number b
  SUB = 3, // Sub(a, b): a-th sub-square matrix must have the number b
}

export function solveSudoku(puzzle: ReadonlyArray<number[]>, solution: number[][]): boolean {
  const encode = (a: number, b: number, c: number): number => a * 81 + b * 9 + c + 1

  dlx.init(DL_TOTAL_COLUMNS)
  const columns: number[] = new Array<number>(4)
  for (let r = 0; r < 9; ++r) {
    for (let c = 0; c < 9; ++c) {
      const w = puzzle[r][c]
      const s = Math.floor(r / 3 + ebs) * 3 + Math.floor(c / 3 + ebs)
      for (let v = 0; v < 9; ++v) {
        if (w === -1 || w === v) {
          columns[0] = encode(SudokuConstraint.SLOT, r, c)
          columns[1] = encode(SudokuConstraint.ROW, r, v)
          columns[2] = encode(SudokuConstraint.COL, c, v)
          columns[3] = encode(SudokuConstraint.SUB, s, v)
          dlx.addRow(encode(r, c, v), columns)
        }
      }
    }
  }

  const answer: number[] | null = dlx.solve()
  if (answer === null) return false

  for (const _code of answer) {
    let code = _code - 1
    const c = code % 9

    code = Math.floor(code / 9 + ebs)
    const b = code % 9

    code = Math.floor(code / 9 + ebs)
    const a = code

    // eslint-disable-next-line no-param-reassign
    solution[a][b] = c
  }
  return true
}
