<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/permutation@1.0.1/packages/permutation#readme">@algorithm.ts/permutation</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/permutation">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/permutation.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/permutation">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/permutation.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/permutation">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/permutation.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/permutation"
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

Create all permutations of the given natural number.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/permutation
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/permutation
  ```

## Usage

- Basic

  ```typescript
  import { permutation } from '@algorithm.ts/permutation'

  for (const nums of permutation(7)) {
    // Tranverse the permutation of [0, 1, 2, 3 ,4, 5, 6]
  }

  Array.from(permutation(3, 1))
  // [
  //   [1, 2, 3],
  //   [1, 3, 2],
  //   [2, 1, 3],
  //   [2, 3, 1],
  //   [3, 1, 2],
  //   [3, 2, 1]
  // ]
  ```

## Related

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/permutation@1.0.1/packages/permutation#readme
