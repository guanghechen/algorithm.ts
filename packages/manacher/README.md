<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/manacher@4.0.0/packages/manacher#readme">@algorithm.ts/manacher</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/manacher">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/manacher.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/manacher">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/manacher.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/manacher">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/manacher.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/manacher"
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

A typescript implementation of the **manacher** algorithm.

Manacher is a linear time algorithm for listing all the palindromes that appear at the start of a
given string.

If you are curious about this algorithm, you can visit [here][manacher] for more details.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/manacher
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/manacher
  ```

## Usage

- A solution of https://leetcode.com/problems/palindrome-partitioning-ii/

  ```typescript
  import manacher from '@algorithm.ts/manacher'

  export function minCut(text: string): number {
    const N: number = text.length
    const radius: number[] = manacher(text)
    const dp: number[] = [0]

    for (let i = 1; i < N; ++i) {
      let answer: number = i < radius[i] * 2 ? 0 : dp[i - 1] + 1
      if (answer > 0) {
        for (let k = 1; k < i; ++k) {
          if (i - k < radius[i + k] * 2) {
            answer = Math.min(answer, dp[k - 1] + 1)
          }
        }
      }
      dp[i] = answer
    }
    return dp[N - 1]
  }
  ```

## Related

- [最长回文子串 Manacher 算法][manacher]

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/manacher@4.0.0/packages/manacher#readme
[manacher]: https://me.guanghechen.com/post/algorithm/string/manacher/
