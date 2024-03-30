<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/dlx@4.0.0-alpha.0/packages/dlx#readme">@algorithm.ts/dlx</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/dlx">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/dlx.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/dlx">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/dlx.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/dlx">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/dlx.svg"
      />
    </a>
    <a href="#install">
      <img
        alt="Module Formats: cjs, esm"
        src="https://img.shields.io/badge/module_formats-cjs%2C%20esm-green.svg"
      />
    </a>
    <a href="https://github.com/nodejs/node">
      <img
        alt="Node.js Version"
        src="https://img.shields.io/node/v/@algorithm.ts/dlx"
      />
    </a>
    <a href="https://github.com/facebook/jest">
      <img
        alt="Tested with Jest"
        src="https://img.shields.io/badge/tested_with-jest-9c465e.svg"
      />
    </a>
    <a href="https://github.com/prettier/prettier">
      <img
        alt="Code Style: prettier"
        src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"
      />
    </a>
  </div>
</header>
<br/>

A typescript implementation of the **DLX** algorithm.

DLX is the Algorithm X that applied the dancing-link. The algorithm is used to solve the exact-cover
problem.

If you are curious about this algorithm, you can visit [here][dlx] for more details.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/dlx
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/dlx
  ```

## Usage

- Use dlx to solve a 9x9 sudoku problem:

  ```typescript
  import { DancingLinkX } from '@algorithm.ts/dlx'

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

  const solution = new Array(9)
  for (let r = 0; r < 9; ++r) solution[r] = new Array(9)
  solveSudoku(
    [
      [8, 6, -1, -1, -1, -1, -1, -1, -1],
      [-1, 5, 1, -1, 0, 8, -1, 4, 3],
      [-1, -1, -1, 5, 7, 1, -1, -1, -1],
      [4, 8, 7, 0, -1, -1, 5, -1, 2],
      [-1, -1, -1, 7, 8, 5, -1, 3, -1],
      [0, 3, -1, 2, -1, -1, 8, -1, -1],
      [1, -1, 3, 8, 2, 7, -1, 6, -1],
      [-1, -1, 6, -1, -1, -1, 3, 8, 7],
      [5, 7, -1, 4, -1, 6, 1, -1, -1]
    ],
    solution
  )   // => true

  // solution:
  // [
  //   [8, 6, 0, 3, 4, 2, 7, 5, 1],
  //   [7, 5, 1, 6, 0, 8, 2, 4, 3],
  //   [3, 2, 4, 5, 7, 1, 6, 0, 8],
  //   [4, 8, 7, 0, 6, 3, 5, 1, 2],
  //   [6, 1, 2, 7, 8, 5, 0, 3, 4],
  //   [0, 3, 5, 2, 1, 4, 8, 7, 6],
  //   [1, 0, 3, 8, 2, 7, 4, 6, 5],
  //   [2, 4, 6, 1, 5, 0, 3, 8, 7],
  //   [5, 7, 8, 4, 3, 6, 1, 2, 0]
  // ]
  ```

## Related

- [洗牌问题和 dlx 算法][dlx]

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/dlx@4.0.0-alpha.0/packages/dlx#readme
[dlx]: https://me.guanghechen.com/post/algorithm/shuffle/#heading-dlx
