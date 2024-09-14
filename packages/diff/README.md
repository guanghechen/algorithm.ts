<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/diff@1.0.2/packages/diff#readme">@algorithm.ts/diff</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/diff">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/diff.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/diff">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/diff.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/diff">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/diff.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/diff"
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

A typescript implementation to find the **diff** of two sequences or strings.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/diff
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/diff
  ```

## Usage

- Basic

  ```typescript
  import { diff, IDiffItem } from '@algorithm.ts/diff'

  const results1: IDiffItem<string>[] = diff('abc', 'ac')
  const results2: IDiffItem<string>[] = diff('abc', 'ac', { lcs = "myers"})
  const results3: IDiffItem<string>[] = diff('abc', 'ac', { lcs = "myers_linear_space"})
  const results4: IDiffItem<string>[] = diff('abc', 'ac', { lcs = "dp"})
  const results5: IDiffItem<number[]>[] = diff([1, 2, 3], [3, 4], { lcs = "dp", equals: (a, b) => a === b })

  // results1 => [ { type: "common", tokens: "a" }, { type: "delete", tokens: "b" }, { type: "common", tokens: "c" } ]
  // results5 => [ { type: "delete", tokens: [1, 2] }, { type: "common", tokens: [3] }, { type: "added", tokens: [4] } ]

  // customized lcs
  import { lcs_myers_linear_space } from '@algorithm.ts/lcs'
  const results6: IDiffItem<number[]>[] = diff([1, 2, 3], [3, 4], { lcs = lcs_myers_linear_space })
  ```

## Related

- [An O(ND) Difference Algorithm and Its Variations](https://mailserver.org/diff2.pdf).
- [最长公共子序列（lcs） | 光和尘][lcs]
- [Longest common subsequence problem | Wikipedia][wikipedia-lcs]
- [@algorithm.ts/lcs](https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/lcs@4.0.4/packages/lcs#readme)

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/diff@1.0.2/packages/diff#readme
[lcs]: https://me.guanghechen.com/post/algorithm/lcs/
[wikipedia-lcs]: https://en.wikipedia.org/wiki/Longest_common_subsequence_problem
