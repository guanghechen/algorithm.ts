<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/isap#readme">@algorithm.ts/isap</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/isap">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/isap.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/isap">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/isap.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/isap">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/isap.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/isap"
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


A typescript implementation of the **ISAP (Improved SAP)** algorithm.

The **ISAP** algorithm is an algorithm for solving network flow problems.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/isap
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/isap
  ```

* deno

  ```typescript
  import { createIsap } from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/isap/src/index.ts'
  ```

## Usage

* Codeforces contest 1082 Problem G (https://codeforces.com/contest/1082/problem/G):

  ```typescript
  import { createIsap } from '@algorithm.ts/isap'

  const isap = createIsap()

  // The implementation of `io` is omitted.
  function solve(io: any): number {
    const [n, m] = io.readIntegersOfLine()

    const source = 0
    const target: number = n + m + 1
    const totalNodes: number = n + m + 2
    isap.init(source, target, totalNodes)

    const nodes: number[] = io.readIntegersOfLine()
    for (let i = 0; i < n; ++i) {
      const weight: number = nodes[i]
      isap.addEdge(i + 1, target, weight)
    }

    let answer = 0
    for (let i = 1; i <= m; ++i) {
      const [u, v, weight] = io.readIntegersOfLine()
      const x = n + i
      answer += weight
      isap.addEdge(source, x, weight)
      isap.addEdge(x, u, Number.MAX_SAFE_INTEGER)
      isap.addEdge(x, v, Number.MAX_SAFE_INTEGER)
    }
    answer -= isap.maxFlow()
    return answer
  }
  ```


## Related

* [@algorithm.ts/dinic](https://github.com/guanghechen/algorithm.ts/tree/main/packages/dinic)
* [@algorithm.ts/mcmf](https://github.com/guanghechen/algorithm.ts/tree/main/packages/mcmf)
* [网络流 24 题](https://me.guanghechen.com/post/algorithm/graph/network-flow/24-problems/)
* [网络流基础之最大权闭合图](https://me.guanghechen.com/post/algorithm/graph/network-flow/%E6%9C%80%E5%A4%A7%E6%9D%83%E9%97%AD%E5%90%88%E5%9B%BE/)


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/isap#readme
