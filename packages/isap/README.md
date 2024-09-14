<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/isap@4.0.3/packages/isap#readme">@algorithm.ts/isap</a>
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

- npm

  ```bash
  npm install --save @algorithm.ts/isap
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/isap
  ```

## Usage

- Simple

  ```typescript
  import { Isap } from '@algorithm.ts/isap'

  const isap = createIsap()
  isap.init(0, 1, 4)
  isap.addEdge(0, 2, 1)
  isap.addEdge(0, 3, 2)
  isap.addEdge(3, 1, 1)

  isap.maxFlow() // => 1

  // Access current residual network.
  class CustomIsap extends Isap {
    public getSnapshot() {
      return {
        N: this._N,
        source: this._source,
        sink: this._sink,
        G: this.G,
        edges: this._edges,
        edgesTot: this._edgesTot,
        dist: this._dist
      }
    }
  }
  ```

### Example

- A solution for Codeforces contest 1082 Problem G (https://codeforces.com/contest/1082/problem/G):

  ```typescript
  import { Isap } from '@algorithm.ts/isap'

  const isap = new Isap()
  export function solveCodeforces1082G(
    nodes: number[],
    edges: Array<[u: number, v: number, weight: number]>,
  ): number {
    const n: number = nodes.length
    const m: number = edges.length

    const source = 0
    const target: number = n + m + 1
    isap.init(source, target, n + m + 2)

    for (let i = 0; i < n; ++i) {
      const weight: number = nodes[i]
      isap.addEdge(i + 1, target, weight)
    }

    let answer = 0
    for (let i = 0; i < m; ++i) {
      const [u, v, weight] = edges[i]
      const x = n + i
      answer += weight
      isap.addEdge(source, x, weight)
      isap.addEdge(x, u, Number.MAX_SAFE_INTEGER)
      isap.addEdge(x, v, Number.MAX_SAFE_INTEGER)
    }
    answer -= isap.maxflow()
    return answer
  }
  ```

- A solution for leetcode "Maximum Students Taking Exam"
  (https://leetcode.com/problems/maximum-students-taking-exam/):

  ```typescript
  import { Isap } from '@algorithm.ts/isap'

  export function maxStudents(seats: string[][]): number {
    const R: number = seats.length
    if (R <= 0) return 0

    const C: number = seats[0].length
    if (C <= 0) return 0

    let total = 0
    const seatCodes: number[][] = new Array(R)
    for (let r = 0; r < R; ++r) seatCodes[r] = new Array(C).fill(-1)

    for (let r = 0; r < R; ++r) {
      for (let c = 0; c < C; ++c) {
        if (seats[r][c] === '.') seatCodes[r][c] = total++
      }
    }

    if (total <= 0) return 0
    if (total === 1) return 1

    const source: number = total * 2
    const target: number = source + 1
    isap.init(source, target, target + 1)

    for (let r = 0; r < R; ++r) {
      for (let c = 0; c < C; ++c) {
        const u: number = seatCodes[r][c]
        if (u > -1) {
          isap.addEdge(source, u, 1)
          isap.addEdge(u + total, target, 1)
          if (r > 0) {
            // Check upper left
            if (c > 0 && seatCodes[r - 1][c - 1] > -1) {
              const v: number = seatCodes[r - 1][c - 1]
              isap.addEdge(u, v + total, 1)
              isap.addEdge(v, u + total, 1)
            }

            // Check upper right
            if (c + 1 < C && seatCodes[r - 1][c + 1] > -1) {
              const v: number = seatCodes[r - 1][c + 1]
              isap.addEdge(u, v + total, 1)
              isap.addEdge(v, u + total, 1)
            }
          }

          // Check left
          if (c > 0 && seatCodes[r][c - 1] > -1) {
            const v: number = seatCodes[r][c - 1]
            isap.addEdge(u, v + total, 1)
            isap.addEdge(v, u + total, 1)
          }
        }
      }
    }

    const totalPaired: number = isap.maxflow() / 2
    return total - totalPaired
  }
  ```

## Related

- [@algorithm.ts/isap](https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/isap@4.0.3/packages/isap)
- [@algorithm.ts/mcmf](https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/mcmf@4.0.3/packages/mcmf)
- [网络流 24 题](https://me.guanghechen.com/post/algorithm/graph/network-flow/24-problems/)
- [网络流基础之最大权闭合图](https://me.guanghechen.com/post/algorithm/graph/network-flow/%E6%9C%80%E5%A4%A7%E6%9D%83%E9%97%AD%E5%90%88%E5%9B%BE/)

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/isap@4.0.3/packages/isap#readme
