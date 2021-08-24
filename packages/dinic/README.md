<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/dinic#readme">@algorithm.ts/dinic</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/dinic">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/dinic.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/dinic">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/dinic.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/dinic">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/dinic.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/dinic"
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


A typescript implementation of the **Dinic** algorithm.

The **Dinic** algorithm is an algorithm for solving network flow problems.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/dinic
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/dinic
  ```

## Usage

* Codeforces contest 1082 Problem G (https://codeforces.com/contest/1082/problem/G):

  ```typescript
  import { createDinic } from '@algorithm.ts/dinic'

  const dinic = createDinic()

  // The implementation of `io` is omitted.
  function solve(io: any): number {
    const [n, m] = io.readIntegersOfLine()

    const source = 0
    const target: number = n + m + 1
    const totalNodes: number = n + m + 2
    const totalEdges: number = n + m * 3
    dinic.init(source, target, totalNodes, totalEdges)

    const nodes: number[] = io.readIntegersOfLine()
    for (let i = 0; i < n; ++i) {
      const weight: number = nodes[i]
      dinic.addEdge(i + 1, target, weight)
    }

    let answer = 0
    for (let i = 1; i <= m; ++i) {
      const [u, v, weight] = io.readIntegersOfLine()
      const x = n + i
      answer += weight
      dinic.addEdge(source, x, weight)
      dinic.addEdge(x, u, Number.MAX_SAFE_INTEGER)
      dinic.addEdge(x, v, Number.MAX_SAFE_INTEGER)
    }
    answer -= dinic.maxFlow()
    return answer
  }
  ```


## Related

* [@algorithm.ts/isap](https://github.com/guanghechen/algorithm.ts/tree/main/packages/isap)
* [网络流 24 题](https://me.guanghechen.com/post/algorithm/graph/network-flow/24-problems/)
* [网络流基础之最大权闭合图](https://me.guanghechen.com/post/algorithm/graph/network-flow/%E6%9C%80%E5%A4%A7%E6%9D%83%E9%97%AD%E5%90%88%E5%9B%BE/)


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/dinic#readme
