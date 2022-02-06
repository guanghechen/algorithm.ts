<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/sliding-window#readme">@algorithm.ts/sliding-window</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/sliding-window">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/sliding-window.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/sliding-window">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/sliding-window.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/sliding-window">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/sliding-window.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/sliding-window"
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


A typescript implementation of the **sliding-window** algorithm.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/sliding-window
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/sliding-window
  ```

* deno

  ```typescript
  import { createSlidingWindow } from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/sliding-window/src/index.ts'
  ```


## Usage

* `SlidingWindow`

  Member                                          | Return    |  Description
  :----------------------------------------------:|:---------:|:---------------------------------------
  `init(WINDOW_SIZE: number, startIdx?: number)`  | `void`    | Initialize a sliding window.
  `moveForward(steps: number)`                    | `void`    | Move the sliding window forward with specified steps.
  `max()`                                         | `number`  | Get the index of the maximum value in the sliding window.

* `createSlidingWindow`

  ```typescript
  export function createSlidingWindow(cmp: (x: number, y: number) => -1 | 0 | 1 | number): ISlidingWindow
  ```

  - `createSlidingWindow((x, y) => nums[x] - nums[y])`: 
    Create a sliding window (the window size is not specified yet), and maintain the index of 
    the nums with the largest value in the window.

  - The `createSlidingWindow((x, y) => nums[y] - nums[x])`:
    Create a sliding window (the window size is not specified yet), and maintain the index of 
    the nums with the smallest value in the window.


### Example

* A solution of https://leetcode.com/problems/sliding-window-maximum/

  ```typescript
  import { createSlidingWindow } from '@algorithm.ts/sliding-window'

  export function maxSlidingWindow(nums: number[], K: number): number[] {
    const N = nums.length
    if (N < K) return []

    const results: number[] = []
    const window = createSlidingWindow((x, y) => nums[x] - nums[y])
    window.init(K)

    window.moveForward(K - 1)
    for (let i = K - 1; i < N; ++i) {
      window.moveForward()
      results.push(nums[window.max()])
    }
    return results
  }
  ```


## Related


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/sliding-window#readme