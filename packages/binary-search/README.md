<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/binary-search@4.0.2/packages/binary-search#readme">@algorithm.ts/binary-search</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/binary-search">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/binary-search.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/binary-search">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/binary-search.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/binary-search">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/binary-search.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/binary-search"
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

Typescript implementations of the binary search related algorithm. Different from the traditional
implementation which find the element in an array with the given condition, this implementation aims
to find a number that satisfied the target condition in the given interval. The condition checker
receive the number currently found as parameter and returns a number indicating the difference
between the currently checking number and the target number. When the returned value is

- `< 0`: It means that the target number is on the right side of the currently checking number.
- `= 0`: It means that this currently checking number is a target number but it does not guarantee
  that there are no other numbers that meet the conditions.
- `> 0`: It means that the target number is on the left side of the currently checking number.

---

This package contains three binary search related algorithm implemented in Typescript:

- binary-search (integer / bigint): Find a number in the given interval such that it satisfies the
  given condition.

  - If there is no such a number, return `null`.
  - if there are multiple such numbers, return any one of them.

- lower-bound (integer / bigint): Find the smallest number in the given interval such that it
  satisfies the given condition.

  - If there is no such a number, return the first number that greater than the target number.

- upper-bound (integer / bigint): Find the smallest number in the given interval such that it is
  greater than the target number.

  - If there is no such a number, return the right boundary of the given interval + 1.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/binary-search
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/binary-search
  ```

## Usage

- Basic

  ```typescript
  import { binarySearch, lowerBound, upperBound } from '@algorithm.ts/binary-search'

  // elements should be ordered.
  const elements: number[] = [2, 3, 7, 11, 19]

  // Find the first index of elements  which are greater or equal than 8
  // elements[3] = 11 >= 8
  lowerBound(0, elements.length, x => elements[x] - 8) // => 3

  // Find the first index of elements  which are greater than 8
  // elements[3] = 11 > 8
  upperBound(0, elements.length, x => elements[x] - 8) // => 3

  // Find the first index of elements  which are equal than 8
  // No such an element equals with 8.
  binarySearch(0, elements.length, x => elements[x] - 8) // => null

  // Find the first index of elements  which are greater or equal than 3
  // elements[1] = 3 >= 3
  lowerBound(0, elements.length, x => elements[x] - 3) // => 1

  // Find the first index of elements  which are greater than 3
  // elements[2] = 7 > 3
  upperBound(0, elements.length, x => elements[x] - 3) // => 7

  // Find the first index of elements  which are equal than 3
  // No such an element equals with 8.
  binarySearch(0, elements.length, x => elements[x] - 3) // => 1
  ```

- Advance

  ```typescript
  import { lowerBound ] from '@algorithm.ts/binary-search'

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

- Bigint

  ```typescript
  import { lowerBoundBigint } from '@algorithm.ts/binary-search'

  lowerBoundBigint(-500000000000n, 5000000000n, x => x - 1n) // => 1n
  ```

## Related

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/binary-search@4.0.2/packages/binary-search#readme
