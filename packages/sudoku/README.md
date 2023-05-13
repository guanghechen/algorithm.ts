<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/sudoku@3.1.0/packages/sudoku#readme">@algorithm.ts/sudoku</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/sudoku">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/sudoku.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/sudoku">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/sudoku.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/sudoku">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/sudoku.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/sudoku"
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


[中文文档](./README-zh.md)


This library is used to solve Sudoku problems and generate Sudoku problems with
unique solution.

The Sudoku problem is described as a square matrix of size (a\*a) \* (a\*a),
and the value of a position in the square matrix is an integer between [-1, a\*a).
Among them, -1 means no value is filled in this position yet. A classic Sudoku
problem needs to satisfy the following constraints:

1. Each position in the square matrix needs to be filled with an integer between [0, a\*a)
2. There are no repeated numbers in each row of the square matrix
3. There are no repeated numbers in each column of the square matrix
4. The square matrix can be divided into a*a sub-squares of size a*a, and there
   are no repeated numbers in each column of the sub-squares
A typescript implementation of the **sudoku** algorithm.

sudoku is a shuffle algorithm, which can complete the shuffle in $O(N)$
time complexity on the basis of only using a constant level of extra space.

If you are curious about this algorithm, you can visit [here][sudoku] for more details.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/sudoku
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/sudoku
  ```


## Usage

* `SudokuSolver`: Solve a Sudoku puzzle.

* `SudokuCreator`: Create a Sudoku data (puzzle and solution) with only unique solution.

* Utility functions

  Function                    | Description
  :--------------------------:|:--------------------------------:
  `createSudokuBoardData`     | Create a sudoku board (one-dimensional array).
  `fillSudokuBoardData`       | Fill the sudoku board with the given value.
  `copySudokuBoardData`       | Copy sudoku board from `src` to `dst`.
  `verifySolution`            | Check if the solution of the given Sudoku game is valid.
  `toMatrixStyleBoardData`    | Convert the one-dimensional array to two-dimensional array.
  `createMatrixCodeMap`       |
  `createMatrixCoordinateMap` |

## Examples

### Solve a sudoku puzzle

* Solve a 16x16 sudoku puzzle

  ```typescript
  import type { ISudokuBoardData } from '@algorithm.ts/sudoku'
  import { SudokuSolver, createSudokuBoardData } from '@algorithm.ts/sudoku'

  // 4 x 4 = 16
  const solver = new SudokuSolver({ childMatrixSize: 4 })

  const puzzle: ISudokuBoardData =  [
     2,  3, 14, -1,  8,  6, -1, -1, -1, 13, -1, -1, -1, 10, 12, -1,
     0, -1, -1, -1, -1, -1,  1,  9, -1, -1,  4, -1,  8, -1, -1,  2,
    -1, -1, -1,  6,  7, -1,  2, -1, -1, -1, 10,  1, -1,  0, -1, 15,
    -1,  8, -1, -1, -1, -1, 12, -1, -1,  5,  0,  7,  4, -1,  1,  6,
     7,  1, -1,  3, -1,  4, 10, 14, -1, -1, -1, -1,  2, -1, 15,  9,
    14, 12, -1, -1,  2,  3, -1, -1,  1, -1,  7, -1, -1,  6, 13, -1,
    10,  2,  5, -1, -1,  0,  7, -1,  3, -1, -1,  8, 11,  1, -1,  4,
    -1, 13,  6, -1, -1, -1, -1,  1, -1, -1, 14,  2, -1,  3,  7, -1,
    -1, -1, -1,  2,  1, -1, -1, -1, -1, -1,  8,  9, 14,  7, -1, -1,
     8,  9, 10, -1,  3, -1, -1,  2,  6, -1, 11, -1, -1, -1,  5,  0,
     1, -1,  3,  5, -1, -1, -1, -1,  4,  0, -1, -1, -1, 11, -1, 12,
     6, -1, -1,  4,  5, -1, 15, 11, 14, -1,  1, -1, 13,  9,  8, -1,
    -1,  6, -1, -1, -1,  2, -1, 12, -1, -1, -1, 14,  9, -1,  0, 13,
    -1, -1,  0,  7, -1,  9, 13,  8, -1, -1,  3, -1, -1,  2,  6, 14,
    -1, -1, -1,  8, -1, 11, -1, -1, -1, 12, -1, -1, 15,  5,  3,  1,
     3, -1, -1, -1, -1, -1, -1, -1,  9, 15,  2,  0, -1,  8, -1, 11
  ]

  solver.solve(puzzle, null)  // => true

  const solution: ISudokuBoardData = createSudokuBoardData(16)
  solver.solve(puzzle, solution)  // => true

  solution 
  /** ===>
   * [
   *    2,  3, 14,  1,  8,  6,  0,  4, 11, 13,  9, 15,  5, 10, 12,  7,
   *    0,  5,  7, 10, 14, 15,  1,  9, 12,  3,  4,  6,  8, 13, 11,  2,
   *   12, 11,  4,  6,  7,  5,  2, 13,  8, 14, 10,  1,  3,  0,  9, 15,
   *   15,  8,  9, 13, 11, 10, 12,  3,  2,  5,  0,  7,  4, 14,  1,  6,
   *    7,  1,  8,  3,  6,  4, 10, 14,  0, 11, 13,  5,  2, 12, 15,  9,
   *   14, 12, 15, 11,  2,  3,  9,  5,  1,  4,  7, 10,  0,  6, 13,  8,
   *   10,  2,  5,  9, 13,  0,  7, 15,  3,  6, 12,  8, 11,  1, 14,  4,
   *    4, 13,  6,  0, 12,  8, 11,  1, 15,  9, 14,  2, 10,  3,  7,  5,
   *   13, 15, 11,  2,  1, 12,  6,  0,  5, 10,  8,  9, 14,  7,  4,  3,
   *    8,  9, 10, 14,  3, 13,  4,  2,  6,  7, 11, 12,  1, 15,  5,  0,
   *    1,  7,  3,  5,  9, 14,  8, 10,  4,  0, 15, 13,  6, 11,  2, 12,
   *    6,  0, 12,  4,  5,  7, 15, 11, 14,  2,  1,  3, 13,  9,  8, 10,
   *   11,  6,  1, 15, 10,  2,  3, 12,  7,  8,  5, 14,  9,  4,  0, 13,
   *    5,  4,  0,  7, 15,  9, 13,  8, 10,  1,  3, 11, 12,  2,  6, 14,
   *    9, 10,  2,  8,  0, 11, 14,  7, 13, 12,  6,  4, 15,  5,  3,  1,
   *    3, 14, 13, 12,  4,  1,  5,  6,  9, 15,  2,  0,  7,  8, 10, 11
   * ]
   */
  ```

### Create a sudoku game data

* Create a 9x9 sudoku puzzle

  ```typescript
  import { SudokuCreator } from '@algorithm.ts/sudoku'

  // 3 x 3 = 9
  const creator = new SudokuCreator({ childMatrixSize: 3 })
  ```

  - Create a easy puzzle.

    ```typescript
    creator.createSudoku()
    // or
    creator.createSudoku(0.2)
    ```

    The result is a js object similar to the one shown below:

    ```json
    {
      "puzzle": [
         8, -1, 6,  1,  0,  2,  3,  5, -1,
         0, -1, 5, -1,  4, -1,  8,  1,  7,
         4,  3, 1,  8, -1, -1,  2,  6,  0,
        -1,  0, 7,  4, -1,  1,  5,  8,  2,
         2,  1, 4,  5,  3, -1, -1,  7,  6,
         5,  6, 8,  0,  2,  7,  4,  3,  1,
         1,  4, 3,  2, -1,  6,  7,  0,  8,
         6,  5, 0,  7,  8,  4,  1,  2,  3,
        -1, -1, 2,  3, -1, -1,  6,  4,  5
      ],
      "solution": [
        8, 7, 6, 1, 0, 2, 3, 5, 4,
        0, 2, 5, 6, 4, 3, 8, 1, 7,
        4, 3, 1, 8, 7, 5, 2, 6, 0,
        3, 0, 7, 4, 6, 1, 5, 8, 2,
        2, 1, 4, 5, 3, 8, 0, 7, 6,
        5, 6, 8, 0, 2, 7, 4, 3, 1,
        1, 4, 3, 2, 5, 6, 7, 0, 8,
        6, 5, 0, 7, 8, 4, 1, 2, 3,
        7, 8, 2, 3, 1, 0, 6, 4, 5
      ]
    }
    ```

  - Create a hard puzzle.

    ```typescript
    creator.createSudoku(1.0)
    ```

    The result is a js object similar to the one shown below:

    ```json
    {
      "puzzle": [
        -1, -1, -1, -1, -1,  8, -1, -1,  4,
        -1, -1, -1,  3, -1, -1,  5,  8, -1,
        -1, -1, -1,  6,  4, -1,  0, -1, -1,
        -1, -1, -1, -1,  2, -1,  6, -1, -1,
        -1,  0, -1, -1, -1, -1,  7,  3,  5,
        -1,  7, -1, -1,  3, -1, -1, -1, -1,
         3, -1, -1, -1, -1,  2, -1, -1,  0,
        -1, -1, -1,  8,  6,  5, -1, -1, -1,
         2, -1,  4, -1, -1, -1, -1, -1, -1
      ],
      "solution": [
        0, 6, 1, 2, 5, 8, 3, 7, 4,
        4, 2, 7, 3, 0, 1, 5, 8, 6,
        8, 3, 5, 6, 4, 7, 0, 2, 1,
        5, 4, 3, 7, 2, 0, 6, 1, 8,
        6, 0, 2, 1, 8, 4, 7, 3, 5,
        1, 7, 8, 5, 3, 6, 4, 0, 2,
        3, 8, 6, 4, 7, 2, 1, 5, 0,
        7, 1, 0, 8, 6, 5, 2, 4, 3,
        2, 5, 4, 0, 1, 3, 8, 6, 7
      ]
    }
    ```

* Create a 16x16 sudoku puzzle

  ```typescript
  import { SudokuCreator } from '@algorithm.ts/sudoku'

  // 4 x 4 = 16
  const creator = new SudokuCreator({ childMatrixSize: 4 })
  creator.createSudoku(0.8)
  ```

  The result is a js object similar to the one shown below:

  ```json
  {
    "puzzle": [
      -1, -1, -1, 12, -1,  5, -1,  9, -1, -1,  6, -1, -1,  1, -1, 14,
      -1,  2,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 15, -1,
      -1, -1,  8, -1, 12, 13,  4,  7,  2, -1, -1, -1, -1, -1, -1, -1,
       7, -1, -1, -1, -1, -1, -1, 14, -1, -1, -1, 12, -1, -1, -1, -1,
       4, -1, 15, -1,  6, -1, -1, -1, -1, -1, 11, -1,  3, -1, -1, -1,
      -1,  8, 10, 14, -1, -1, -1, -1,  5, 13, -1, -1, -1,  9, -1, -1,
      -1, -1,  6, 11,  3, 14, -1, -1,  0,  2, -1,  4, -1, -1, -1, 15,
      -1,  5, 13, -1, -1,  7, -1, -1,  9, -1, -1,  3,  2, -1, 10, -1,
      -1, -1, -1, -1, -1, -1, 14, -1,  6,  9, -1, -1, 10,  8, -1, -1,
      -1, -1, 14,  0,  7,  3, -1,  2, -1, 10, -1, -1, 15, 13, -1,  9,
      -1,  9,  7, -1, -1, -1, -1, 12, -1, 15, -1,  1, -1, -1,  0, -1,
      11, -1,  3, -1, -1,  0, -1, 15, 14,  5, -1, -1, -1,  2, 12,  6,
      -1, -1,  0, 13, -1, -1, -1,  5, -1, 11,  9, -1,  4, -1,  6,  3,
      -1, -1,  2, -1, -1, -1, 10, -1, 15,  6, -1, -1, 14, -1, -1, -1,
      -1, -1, -1, -1, 15, 12, -1, -1, -1,  4,  7, -1, -1, -1,  9, -1,
       6, -1, -1, -1, -1, -1,  8, -1, -1, -1,  5, -1, -1,  0, -1, -1
    ],
    "solution": [
      10,  3, 11, 12,  8,  5,  2,  9,  4,  7,  6, 15,  0,  1, 13, 14,
      13,  2,  4,  9,  1,  6,  3,  0, 11,  8, 14,  5, 12,  7, 15, 10,
       0, 14,  8, 15, 12, 13,  4,  7,  2,  1, 10,  9,  6,  3, 11,  5,
       7,  6,  1,  5, 11, 10, 15, 14, 13,  0,  3, 12,  9,  4,  8,  2,
       4,  0, 15,  2,  6,  9,  1, 13,  7, 12, 11, 10,  3,  5, 14,  8,
       3,  8, 10, 14,  2, 15, 12,  4,  5, 13,  1,  6, 11,  9,  7,  0,
       9,  7,  6, 11,  3, 14,  5, 10,  0,  2,  8,  4, 13, 12,  1, 15,
      12,  5, 13,  1,  0,  7, 11,  8,  9, 14, 15,  3,  2,  6, 10,  4,
      15, 13, 12,  4,  5, 11, 14,  1,  6,  9,  2,  0, 10,  8,  3,  7,
       5,  1, 14,  0,  7,  3,  6,  2,  8, 10, 12, 11, 15, 13,  4,  9,
       2,  9,  7,  6, 10,  8, 13, 12,  3, 15,  4,  1,  5, 14,  0, 11,
      11, 10,  3,  8,  4,  0,  9, 15, 14,  5, 13,  7,  1,  2, 12,  6,
       1, 12,  0, 13, 14,  2,  7,  5, 10, 11,  9,  8,  4, 15,  6,  3,
       8,  4,  2,  7,  9,  1, 10,  3, 15,  6,  0, 13, 14, 11,  5, 12,
      14, 11,  5,  3, 15, 12,  0,  6,  1,  4,  7,  2,  8, 10,  9, 13,
       6, 15,  9, 10, 13,  4,  8, 11, 12,  3,  5, 14,  7,  0,  2,  1
    ]
  }
  ```


## Related

* [洗牌问题和 dlx 算法 | 光和尘][dlx]
* [洗牌问题和 knuth-shuffle 算法 | 光和尘][knuth-shuffle]
* [当你想来一把数独 | 光和尘](https://me.guanghechen.com/post/game/sudoku/)


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/sudoku@3.1.0/packages/sudoku#readme
[knuth-shuffle]: https://me.guanghechen.com/post/algorithm/shuffle/#heading-knuth-shuffle
[dlx]: https://me.guanghechen.com/post/algorithm/shuffle/#heading-dlx
