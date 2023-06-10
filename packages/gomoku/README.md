<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/gomoku@3.1.1/packages/gomoku#readme">@algorithm.ts/gomoku</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/gomoku">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/gomoku.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/gomoku">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/gomoku.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/gomoku">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/gomoku.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/gomoku"
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


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/gomoku
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/gomoku
  ```

## Usage

* Basic

  ```typescript
  import { Solution } from '@algorithm.ts/gomoku'

  const solution = new Solution({
    MAX_ROW: 15,
    MAX_COL: 15,
    MAX_ADJACENT: 5,
    MAX_DISTANCE_OF_NEIGHBOR: 2,
  })

  // Let's use 0 to represent WHITE piece and 1 to represent BLACK piece.
  // The chessboard can be regarded as a two-dimensional coordinate system, in which the y-axis is
  // to the right, the x-axis is downward, and the position of the first moveable piece on the
  // chessboard is (0,0)

  // put a WHITE piece on the position (7, 7).
  solution.forward(7, 7, 0)

  // put a BLACK piece on the position (6, 6).
  solution.forward(6, 6, 1)

  // ... (Omit some chess moves)

  // Try to choose a favorable position to place the WHITE piece in the free position of the chessboard.
  const [r0, c0] = solution.minimaxSearch(0)

  // Try to choose a favorable position to place the BLACK piece in the free position of the chessboard.
  const [r1, c1] = solution.minimaxSearch(1)
  ```


## Related


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/gomoku@3.1.1/packages/gomoku#readme
