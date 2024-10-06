<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/lcs@4.0.5/packages/lcs#readme">@algorithm.ts/lcs</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/lcs">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/lcs.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/lcs">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/lcs.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/lcs">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/lcs.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/lcs"
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

A typescript implementation to find the **lcs** (Longest Common Subsequence).

This package provide three different implementation of lcs algorithm. To measure the complexity of
these algorithms, let the $N_1$ and $N_2$ be the subsequences length of two sequences respectively.
And let $L$ be the length of the longest common subsequences, then the $D = 2L - N_1 - N_2$.

1. `myers_lcs(N1: number, N2: number, equals: (x: number, y: number) => boolean): [x: number, y: number][]`:
   The vanilla algorithm introduced by this paper
   [_An O(ND) Difference Algorithm and Its Variations_](https://mailserver.org/diff2.pdf).

   - Time complexity: $O((N_1 + N_2) \times D)$
   - Memory complexity: $O(N_1 \times N_2)$

2. `myers_lcs_linear_space(N1: number, N2: number, equals: (x: number, y: number) => boolean): [x: number, y: number][]`:
   The linear space refinement algorithm from
   [_An O(ND) Difference Algorithm and Its Variations_](https://mailserver.org/diff2.pdf).

   - Time complexity: $O((N_1 + N_2) * D)$
   - Memory complexity: $O(N_1 + N_2)$

3. `lcs_dp(N1: number, N2: number, equals: (x: number, y: number) => boolean): [x: number, y: number][]`
   This implementation is based on dynamic programming, and can find the minimal lexicographical
   lcs.

   - Time complexity: $O(N_1 \times N_2)$
   - Memory complexity: $O(N_1 \times N_2)$

The following definition is quoted from Wikipedia
(https://en.wikipedia.org/wiki/Longest_common_subsequence_problem):

> The longest common subsequence (LCS) problem is the problem of finding the longest subsequence
> common to all sequences in a set of sequences (often just two sequences). It differs from the
> longest common substring problem: unlike substrings, subsequences are not required to occupy
> consecutive positions within the original sequences. The longest common subsequence problem is a
> classic computer science problem, the basis of data comparison programs such as the diff utility,
> and has applications in computational linguistics and bioinformatics. It is also widely used by
> revision control systems such as Git for reconciling multiple changes made to a
> revision-controlled collection of files.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/lcs
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/lcs
  ```

## Usage

- Basic

  ```typescript
  import { lcs_dp, lcs_myers_size } from '@algorithm.ts/lcs'

  const s1: number[] = [1, 2, 3, 4, 6, 6, 7, 8, 6]
  const s2: number[] = [2, 3, 4, 7, 9, 8, 2, 3, 5, 2]

  lcs_myers_size(s1.length, s2.length, (x, y) => s1[x] === s2[y]) // => 5

  lcs_dp(s1.length, s2.length, (x, y) => s1[x] === s2[y])
  // => [ [1, 0], [2, 1], [3, 2], [6, 3], [7, 5] ]
  //
  //    Here is why:
  //
  //          0 1 2 3 4 5 6 7 8 9
  //      s1: 1 2 3 4 6 6 7 8 6
  //      s2: 2 3 4 7 9 8 2 3 5 2
  //
  //      s1[1] <----> s2[0]
  //      s1[2] <----> s2[1]
  //      s1[3] <----> s2[2]
  //      s1[6] <----> s2[3]
  //      null  <----> s2[4]
  //      s1[7] <----> s2[5]
  //      null  <----> s2[6]
  //      null  <----> s2[7]
  //      null  <----> s2[8]
  //      null  <----> s2[9]
  ```

## Related

- [An O(ND) Difference Algorithm and Its Variations](https://mailserver.org/diff2.pdf).
- [最长公共子序列（LCS） | 光和尘][lcs]
- [Longest common subsequence problem | Wikipedia][wikipedia-lcs]

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/lcs@4.0.5/packages/lcs#readme
[lcs]: https://me.guanghechen.com/post/algorithm/lcs/
[wikipedia-lcs]: https://en.wikipedia.org/wiki/Longest_common_subsequence_problem
