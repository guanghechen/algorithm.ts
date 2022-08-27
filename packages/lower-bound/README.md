<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/lower-bound#readme">@algorithm.ts/lower-bound</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/lower-bound">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/lower-bound.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/lower-bound">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/lower-bound.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/lower-bound">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/lower-bound.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/lower-bound"
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


A typescript implementation of the **lower bound** algorithm.

The lower bound algorithm is desired to find the index of first elements which
greater or equals than the target element.

## Install

* npm

  ```bash
  npm install --save @algorithm.ts/lower-bound
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/lower-bound
  ```

* deno

  ```typescript
  import lowerBound from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/lower-bound/src/index.ts'
  ```


## Usage

* Basic

  ```typescript
  import lowerBound from '@algorithm.ts/lower-bound'

  // elements should be ordered.
  const elements: number[] = [2, 3, 7, 11, 19]
  
  // Find the index of elements which is the first element greater or equal than 8
  // elements[3] = 11 >= 8
  lowerBound(0, elements.length, x => elements[x] - 8) // => 3

  // Find the index of elements which is the first element greater or equal than 3
  // elements[1] = 3 >= 3
  lowerBound(0, elements.length, x => elements[x] - 3) // => 1
  ```

* Complex

  ```typescript
  import lowerBound from '@algorithm.ts/lower-bound'

  const fruits = [
    { type: 'orange', price: 3 },
    { type: 'apple', price: 10 },
    { type: 'banana', price: 10 },
    { type: 'watermelon', price: 12 },
    { type: 'lemon', price: 15 },
  ]

  // Find the index of fruits which price is greater or equal than 10
  lowerBound(0, fruits.length, x => fruits[x].price - 10) // => 1

  // Find the index of fruits which price is greater or equal than 11
  lowerBound(0, fruits.length, x => fruits[x].price - 11) // => 3
  ```

* Bigint

  ```typescript
  import { lowerBoundBigint } from '@algorithm.ts/lower-bound'

  lowerBoundBigint(-500000000000n, 5000000000n, x => x - 1n) // => 1n
  ```


## Related


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/lower-bound#readme
