<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/dijkstra#readme">@algorithm.ts/dijkstra</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/dijkstra">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/dijkstra.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/dijkstra">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/dijkstra.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/dijkstra">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/dijkstra.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/dijkstra"
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


A typescript implementation of the **dijkstra** algorithm.

The following definition is quoted from Wikipedia (https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm):

> Dijkstra's algorithm (/ˈdaɪkstrəz/ *DYKE-strəz*) is an algorithm for finding
> the shortest paths between nodes in a graph, which may represent, for example,
> road networks. It was conceived by computer scientist Edsger W. Dijkstra in
> 1956 and published three years later.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/dijkstra
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/dijkstra
  ```

* deno

  ```typescript
  import dijkstra from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/dijkstra/src/index.ts'
  ```

## Usage

* Simple

  ```typescript
  import dijkstra from '@algorithm.ts/dijkstra'

  const dist: number[] = dijkstra({
    N: 4,
    source: 0,
    edges: [
      { to: 1, cost: 2 },
      { to: 2, cost: 2 },
      { to: 3, cost: 2 },
      { to: 3, cost: 1 },
    ],
    G: [[0], [1, 2], [3], []],
  })
  // => [0, 2, 4, 4]
  // 
  //    Which means:
  //      0 --> 0: cost is 0
  //      0 --> 1: cost is 2
  //      0 --> 2: cost is 4
  //      0 --> 3: cost is 4
  ```

* Pass custom `dist` array.

  ```typescript
  import dijkstra from '@algorithm.ts/dijkstra'

  const dist: number[] = []
  dijkstra({
    N: 4,
    source: 0,
    edges: [
      { to: 1, cost: 2 },
      { to: 2, cost: 2 },
      { to: 3, cost: 2 },
      { to: 3, cost: 1 },
    ],
    G: [[0], [1, 2], [3], []],
    dist,
  })

  dist // => [0, 2, 4, 4]
  ```

### Example

* A solution for leetcode "Number of Ways to Arrive at Destination"
  (https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/):

  ```typescript
  import type { IEdge } from '@algorithm.ts/dijkstra'
  import dijkstra from '@algorithm.ts/dijkstra'

  const MOD = 1e9 + 7
  export function countPaths(N: number, roads: number[][]): number {
    const edges: IEdge[] = []
    const G: number[][] = new Array(N)
    for (let i = 0; i < N; ++i) G[i] = []
    for (const [from, to, cost] of roads) {
      G[from].push(edges.length)
      edges.push({ to, cost })

      G[to].push(edges.length)
      edges.push({ to: from, cost })
    }

    const source = 0
    const target = N - 1
    const dist: number[] = dijkstra({ N, source: target, edges, G, dist: customDist }, { INF: 1e12 })

    const dp: number[] = new Array(N).fill(-1)
    return dfs(source)

    function dfs(o: number): number {
      if (o === target) return 1

      let answer = dp[o]
      if (answer !== -1) return answer

      answer = 0
      const d = dist[o]
      for (const idx of G[o]) {
        const e: IEdge = edges[idx]
        if (dist[e.to] + e.cost === d) {
          const t = dfs(e.to)
          answer = modAdd(answer, t)
        }
      }
      return dp[o] = answer
    }
  }

  function modAdd(x: number, y: number): number {
    const z: number = x + y
    return z < MOD ? z : z - MOD
  }
  ```


## Related

* 《算法竞赛入门经典（第2版）》（刘汝佳）： P359-P362 Dijkstra 算法
* [dijkstra 算法 | 光和尘][dijkstra]
* [dijkstra | Wikipedia][wikipedia-dijkstra]
* [@algorithm.ts/dijkstra-bigint][]
* [@algorithm.ts/priority-queue][]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/dijkstra#readme
[wikipedia-dijkstra]: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
[dijkstra]: https://me.guanghechen.com/post/algorithm/graph/shortest-path/dijkstra
[@algorithm.ts/dijkstra-bigint]: https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/dijkstra-bigint
[@algorithm.ts/priority-queue]: https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/priority-queue