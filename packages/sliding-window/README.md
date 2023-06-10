<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/sliding-window@3.1.1/packages/sliding-window#readme">@algorithm.ts/sliding-window</a>
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


## Usage

* `SlidingWindow`

  Member                                          | Return              |  Description
  :----------------------------------------------:|:-------------------:|:---------------------------------------
  `constructor(options: ISlidingWindowProps)`     | `SlidingWindow`     | 
  `reset(options?: ISlidingWindowResetOptions)`   | `void`              | Reset the sliding window.
  `forwardLeftBoundary(steps?: number)`           | `void`              | Move the sliding window left boundary forward by `steps` steps.
  `forwardRightBoundary(steps?: number)`          | `void`              | Move the sliding window right boundary forward by `steps` steps.
  `min()`                                         | `number|undefined`  | Return the minimum element in the Sliding Window.

* `ISlidingWindowProps`

  - `WINDOW_SIZE`: (required) the width of the sliding window.

  - `compare`: (required) compare two index to determine which one is smaller.

  - `startIndex`: (optional) the first index of the input range.


## Example

* A solution of https://leetcode.com/problems/sliding-window-maximum/

  ```typescript
  import { SlidingWindow } from '@algorithm.ts/sliding-window'

  export function maxSlidingWindow(nums: number[], K: number): number[] {
    const N = nums.length
    if (N < K) return []

    const results: number[] = []
    const window = new SlidingWindow({
      WINDOW_SIZE: K,
      compare: (x, y) => nums[y] - nums[x],
    })

    window.forwardRightBoundary(K - 1)
    for (let i = K - 1; i < N; ++i) {
      window.forwardRightBoundary()
      results.push(nums[window.min()!])
    }
    return results
  }
  ```


## Related


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/sliding-window@3.1.1/packages/sliding-window#readme
