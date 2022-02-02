<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/dijkstra-bigint#readme">@algorithm.ts/dijkstra-bigint</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/dijkstra-bigint">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/dijkstra-bigint.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/dijkstra-bigint">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/dijkstra-bigint.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/dijkstra-bigint">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/dijkstra-bigint.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/dijkstra-bigint"
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


A typescript implementation of the **dijkstra** algorithm (bigint version).

The following definition is quoted from Wikipedia (https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm):

> Dijkstra's algorithm (/ˈdaɪkstrəz/ *DYKE-strəz*) is an algorithm for finding
> the shortest paths between nodes in a graph, which may represent, for example,
> road networks. It was conceived by computer scientist Edsger W. Dijkstra in
> 1956 and published three years later.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/dijkstra-bigint
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/dijkstra-bigint
  ```

* deno

  ```typescript
  import dijkstra from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/dijkstra-bigint/src/index.ts'
  ```

## Usage

* Simple

  ```typescript
  import dijkstra from '@algorithm.ts/dijkstra-bigint'

  const dist: bigint[] = dijkstra({
    N: 4,
    source: 0,
    edges: [
      { to: 1, cost: 2n },
      { to: 2, cost: 2n },
      { to: 3, cost: 2n },
      { to: 3, cost: 1n },
    ],
    G: [[0], [1, 2], [3], []],
  })
  // => [0n, 2n, 4n, 4n]
  // 
  //    Which means:
  //      0 --> 0: cost is 0n
  //      0 --> 1: cost is 2n
  //      0 --> 2: cost is 4n
  //      0 --> 3: cost is 4n
  ```

* Pass custom `dist` array.

  ```typescript
  import dijkstra from '@algorithm.ts/dijkstra-bigint'

  const dist: bigint[] = []
  dijkstra({
    N: 4,
    source: 0,
    edges: [
      { to: 1, cost: 2n },
      { to: 2, cost: 2n },
      { to: 3, cost: 2n },
      { to: 3, cost: 1n },
    ],
    G: [[0], [1, 2], [3], []],
    dist,
  })

  dist // => [0n, 2n, 4n, 4n]
  ```

### Example

* A solution for leetcode "Number of Ways to Arrive at Destination"
  (https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/):

  ```typescript
  import type { IEdge } from '@algorithm.ts/dijkstra-bigint'
  import dijkstra from '@algorithm.ts/dijkstra-bigint'

  const MOD = BigInt(1e9 + 7)
  export function countPaths(N: number, roads: number[][]): number {
    const edges: IEdge[] = []
    const G: number[][] = new Array(N)
    for (let i = 0; i < N; ++i) G[i] = []
    for (const [from, to, _cost] of roads) {
      const cost = BigInt(_cost)

      G[from].push(edges.length)
      edges.push({ to, cost })

      G[to].push(edges.length)
      edges.push({ to: from, cost })
    }

    const source = 0
    const target = N - 1
    const dist: bigint[] = dijkstra({ N, source: target, edges, G, dist: customDist }, { INF: BigInt(1e12) })

    const dp: bigint[] = new Array(N).fill(-1n)
    return Number(dfs(source))

    function dfs(o: number): bigint {
      if (o === target) return 1n

      let answer = dp[o]
      if (answer !== -1n) return answer

      answer = 0n
      const d = dist[o]
      for (const idx of G[o]) {
        const e: IEdge = edges[idx]
        if (dist[e.to] + e.cost === d) {
          const t = dfs(e.to)
          answer = modAdd(answer, t)
        }
      }
      dp[o] = answer
      return answer
    }
  }
  ```


## Related

* 《算法竞赛入门经典（第2版）》（刘汝佳）： P359-P362 Dijkstra 算法
* [dijkstra 算法 | 光和尘][dijkstra]
* [dijkstra | Wikipedia][wikipedia-dijkstra]
* [@algorithm.ts/dijkstra][]
* [@algorithm.ts/priority-queue][]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/dijkstra-bigint#readme
[wikipedia-dijkstra]: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
[dijkstra]: https://me.guanghechen.com/post/algorithm/graph/shortest-path/dijkstra
[@algorithm.ts/dijkstra]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/dijkstra
[@algorithm.ts/priority-queue]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/priority-queue