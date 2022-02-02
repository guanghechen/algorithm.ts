<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/mcmf#readme">@algorithm.ts/mcmf</a>
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

* deno

  ```typescript
  import { createMcmf } from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/mcmf/src/index.ts'
  ```

## Usage

* Codeforces contest 1082 Problem G (https://codeforces.com/contest/1082/problem/G):

  ```typescript
  import { createMcmf } from '@algorithm.ts/mcmf'

  const mcmf = createMcmf()

  // The implementation of `io` is omitted.
  function solve(io: any): number {
    const [n, m] = io.readIntegersOfLine()

    const source = 0
    const target: number = n + m + 1
    mcmf.init(source, target, n + m + 2, n + m * 3)

    const nodes: number[] = io.readIntegersOfLine()
    for (let i = 0; i < n; ++i) {
      const weight: number = nodes[i]
      mcmf.addEdge(i + 1, target, weight, 1)
    }

    let answer = 0
    for (let i = 1; i <= m; ++i) {
      const [u, v, weight] = io.readIntegersOfLine()
      const x = n + i
      answer += weight
      mcmf.addEdge(source, x, weight, 1)
      mcmf.addEdge(x, u, Number.MAX_SAFE_INTEGER, 1)
      mcmf.addEdge(x, v, Number.MAX_SAFE_INTEGER, 1)
    }

    const [mincost, maxflow] = mcmf.minCostMaxFlow()
    answer -= maxflow
    return answer
  }
  ```

* Codeforces contest 0277 Problem E (https://codeforces.com/contest/277/problem/E):

  ```typescript
  import { createMcmf } from '@algorithm.ts/mcmf'

  const mcmf = createMcmf()

  // The implementation of `io` is omitted.
  function solve(io: any): number {
    const [N] = io.readIntegersOfLine()

    const vertexes: Vertex[] = new Array(N)
    for (let i = 0; i < N; ++i) {
      const [x, y] = io.readIntegersOfLine()
      vertexes[i] = { x, y }
    }
    vertexes.sort((p, q) => {
      if (p.y === q.y) return p.x - q.x
      return q.y - p.y
    })

    const source = 0
    const target: number = N * 2 + 1
    mcmf.init(source, target, N * 2 + 2, N * N + 2 * N)

    for (let i = 0; i < N; ++i) {
      mcmf.addEdge(source, i + 1, 2, 0)
      mcmf.addEdge(N + i + 1, target, 1, 0)
      for (let j = i + 1; j < N; ++j) {
        if (vertexes[i].y === vertexes[j].y) continue
        mcmf.addEdge(i + 1, N + j + 1, 1, dist(vertexes[i], vertexes[j]))
      }
    }

    const [mincost, maxflow] = mcmf.minCostMaxFlow()
    const answer = maxflow === N - 1 ? mincost : -1
    return answer
  }

  function dist(p: Vertex, q: Vertex): number {
    const d = (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y)
    return Math.sqrt(d)
  }

  interface Vertex {
    x: number
    y: number
  }
  ```

## Related


* [@algorithm.ts/dinic](https://github.com/guanghechen/algorithm.ts/tree/main/packages/dinic)
* [@algorithm.ts/isap](https://github.com/guanghechen/algorithm.ts/tree/main/packages/isap)
* [网络流 24 题](https://me.guanghechen.com/post/algorithm/graph/network-flow/24-problems/)
* [网络流基础之最大权闭合图](https://me.guanghechen.com/post/algorithm/graph/network-flow/%E6%9C%80%E5%A4%A7%E6%9D%83%E9%97%AD%E5%90%88%E5%9B%BE/)


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/mcmf#readme
