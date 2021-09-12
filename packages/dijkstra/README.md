<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/dijkstra#readme">@algorithm.ts/dijkstra</a>
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

A solution for leetcode "Number of Ways to Arrive at Destination"
(https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/):

```typescript
import type { DijkstraEdge } from '@algorithm.ts/dijkstra'
import dijkstra from '@algorithm.ts/dijkstra'

export function countPaths(N: number, roads: number[][]): number {
  const MOD = 1e9 + 7
  const G: Array<Array<DijkstraEdge<number>>> = new Array(N)
  for (let i = 0; i < N; ++i) G[i] = []
  for (const road of roads) {
    G[road[0]].push({ to: road[1], cost: road[2] })
    G[road[1]].push({ to: road[0], cost: road[2] })
  }

  const source = 0
  const target = N - 1
  const dist: number[] = dijkstra<number>(N, target, G, 0, 1e12)

  const dp: number[] = new Array(N).fill(-1)
  return dfs(source)

  function dfs(o: number): number {
    if (o === target) return 1

    let answer = dp[o]
    if (answer !== -1) return answer

    answer = 0
    const d = dist[o]
    for (const e of G[o]) {
      if (dist[e.to] + e.cost === d) {
        const t = dfs(e.to)
        answer = modAdd(answer, t)
      }
    }
    dp[o] = answer
    return answer
  }

  function modAdd(x: number, y: number): number {
    const z: number = x + y
    return z < MOD ? z : z - MOD
  }
}
```


## Related

* [dijkstra 算法][dijkstra]
* [@algorithm.ts/priority-queue][]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/dijkstra#readme
[dijkstra]: https://me.guanghechen.com/post/algorithm/graph/shortest-path/dijkstra
[@algorithm.ts/priority-queue]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/priority-queue