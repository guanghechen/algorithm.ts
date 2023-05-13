<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/mcmf@3.1.0/packages/mcmf#readme">@algorithm.ts/mcmf</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/mcmf">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/mcmf.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/mcmf">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/mcmf.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/mcmf">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/mcmf.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/mcmf"
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

A typescript implementation of the **MCMF (Min Cost Max Flow)** algorithm.

The **MCMF** algorithm is an algorithm for solving network flow problems.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/mcmf
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/mcmf
  ```


## Usage

* Codeforces contest 0277 Problem E (https://codeforces.com/contest/277/problem/E):

  ```typescript
  import { Mcmf } from '@algorithm.ts/mcmf'

  const mcmf = new Mcmf()
  export function solveCodeforces0277E(coordinates: Array<[x: number, y: number]>): number {
    const N: number = coordinates.length

    const vertexes: IVertex[] = coordinates
      .map(([x, y]) => ({ x, y }))
      .sort((p, q) => {
        if (p.y === q.y) return p.x - q.x
        return q.y - p.y
      })

    const source = 0
    const target: number = N * 2 + 1
    mcmf.init(source, target, N * 2 + 2)

    for (let i = 0; i < N; ++i) {
      mcmf.addEdge(source, i + 1, 2, 0)
      mcmf.addEdge(N + i + 1, target, 1, 0)
      for (let j = i + 1; j < N; ++j) {
        if (vertexes[i].y === vertexes[j].y) continue
        mcmf.addEdge(i + 1, N + j + 1, 1, dist(vertexes[i], vertexes[j]))
      }
    }

    const { mincost, maxflow } = mcmf.minCostMaxFlow()
    const answer = maxflow === N - 1 ? mincost : -1
    return answer
  }

  function dist(p: IVertex, q: IVertex): number {
    const d = (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y)
    return Math.sqrt(d)
  }

  interface IVertex {
    x: number
    y: number
  }
  ```


* A solution for Codeforces contest 1082 Problem G (https://codeforces.com/contest/1082/problem/G):

  ```typescript
  import { Mcmf } from '@algorithm.ts/mcmf'

  const mcmf = new Mcmf()
  export function solveCodeforces1082G(
    nodes: number[],
    edges: Array<[u: number, v: number, weight: number]>,
  ): number {
    const n: number = nodes.length
    const m: number = edges.length

    const source = 0
    const target: number = n + m + 1
    mcmf.init(source, target, n + m + 2)

    for (let i = 0; i < n; ++i) {
      const weight: number = nodes[i]
      mcmf.addEdge(i + 1, target, weight, 0)
    }

    let answer = 0
    for (let i = 0; i < m; ++i) {
      const [u, v, weight] = edges[i]
      const x = n + i
      answer += weight
      mcmf.addEdge(source, x, weight, 0)
      mcmf.addEdge(x, u, Number.MAX_SAFE_INTEGER, 0)
      mcmf.addEdge(x, v, Number.MAX_SAFE_INTEGER, 0)
    }

    const { mincost, maxflow } = mcmf.minCostMaxFlow()
    answer -= maxflow
    return answer
  }
  ```

* A solution for leetcode "Maximum Students Taking Exam" (https://leetcode.com/problems/maximum-students-taking-exam/):

  ```typescript
  import { Mcmf } from '@algorithm.ts/mcmf'

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
    const mcmf = new Mcmf()
    mcmf.init(source, target, target + 1)

    for (let r = 0; r < R; ++r) {
      for (let c = 0; c < C; ++c) {
        const u: number = seatCodes[r][c]
        if (u > -1) {
          mcmf.addEdge(source, u, 1, 0)
          mcmf.addEdge(u + total, target, 1, 0)
          if (r > 0) {
            // Check upper left
            if (c > 0 && seatCodes[r - 1][c - 1] > -1) {
              const v: number = seatCodes[r - 1][c - 1]
              mcmf.addEdge(u, v + total, 1, 0)
              mcmf.addEdge(v, u + total, 1, 0)
            }

            // Check upper right
            if (c + 1 < C && seatCodes[r - 1][c + 1] > -1) {
              const v: number = seatCodes[r - 1][c + 1]
              mcmf.addEdge(u, v + total, 1, 0)
              mcmf.addEdge(v, u + total, 1, 0)
            }
          }

          // Check left
          if (c > 0 && seatCodes[r][c - 1] > -1) {
            const v: number = seatCodes[r][c - 1]
            mcmf.addEdge(u, v + total, 1, 0)
            mcmf.addEdge(v, u + total, 1, 0)
          }
        }
      }
    }

    const { mincost, maxflow } = mcmf.minCostMaxFlow()
    const totalPaired: number = maxflow / 2
    return total - totalPaired
  }
  ```

## Related


* [@algorithm.ts/dinic](https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/dinic@3.1.0/packages/dinic)
* [@algorithm.ts/mcmf](https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/mcmf@3.1.0/packages/mcmf)
* [网络流 24 题](https://me.guanghechen.com/post/algorithm/graph/network-flow/24-problems/)
* [网络流基础之最大权闭合图](https://me.guanghechen.com/post/algorithm/graph/network-flow/%E6%9C%80%E5%A4%A7%E6%9D%83%E9%97%AD%E5%90%88%E5%9B%BE/)


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/mcmf@3.1.0/packages/mcmf#readme
