<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/bellman-ford@3.1.0/packages/bellman-ford#readme">@algorithm.ts/bellman-ford</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/bellman-ford">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/bellman-ford.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/bellman-ford">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/bellman-ford.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/bellman-ford">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/bellman-ford.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/bellman-ford"
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


A typescript implementation of the **bellman-ford** algorithm.

The following definition is quoted from Wikipedia (https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm):

> The Bellman–Ford algorithm is an algorithm that computes shortest paths from a single source
> vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra's algorithm
> for the same problem, but more versatile, as it is capable of handling graphs in which some of
> the edge weights are negative numbers. The algorithm was first proposed by Alfonso Shimbel (1955),
> but is instead named after Richard Bellman and Lester Ford Jr., who published it in 1958 and 1956,
> respectively. Edward F. Moore also published a variation of the algorithm in 1959, and for this
> reason it is also sometimes called the Bellman–Ford–Moore algorithm.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/bellman-ford
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/bellman-ford
  ```


## Usage

* Simple

  ```typescript
  import type { IGraph } from '@algorithm.ts/bellman-ford'
  import bellmanFord from '@algorithm.ts/bellman-ford'

  const graph: IBellmanFordGraph<number> = {
    N: 4,
    source: 0,
    edges: [
      { to: 1, cost: 2 },
      { to: 2, cost: 2 },
      { to: 3, cost: 2 },
      { to: 3, cost: 1 },
    ],
    G: [[0], [1, 2], [3], []],
  }

  const result = bellmanFord(graph)
  /**
   * {
   *   hasNegativeCycle: false, // there is no negative-cycle.
   *   INF: 4503599627370494,
   *   source: 0,
   *   bestFrom: ,
   *   dist: [0, 2, 4, 4] 
   * }
   * 
   * For dist:
   *    0 --> 0: cost is 0
   *    0 --> 1: cost is 2
   *    0 --> 2: cost is 4
   *    0 --> 3: cost is 4
   */
  ```

* Options

  Name        | Type            | Required  | Description
  :----------:|:---------------:|:---------:|:----------------
  `INF`       | `number|bigint` | `false`   | A big number, representing the unreachable cost.


### Example

* Get shortest path.

  ```typescript
  import bellmanFord from '@algorithm.ts/bellman-ford'
  import { getShortestPath } from '@algorithm.ts/graph'

  const A = 0
  const B = 1
  const C = 2
  const D = 3

  const graph: IGraph = {
    N: 4,
    source: A,
    edges: [
      // Nodes: [A, B, C, D]
      { to: B, cost: 1 },       // A-B (1)
      { to: A, cost: -1 },      // B-A (-1)
      { to: C, cost: 0.87 },    // B-C (0.87)
      { to: B, cost: -0.87 },   // C-B (-0.87)
      { to: D, cost: 5 },       // C-D (5)
      { to: C, cost: -5 },      // D-C (-5)
    ],
    G: [[0], [1, 2], [3, 4], [5]],
  }

  const result = _bellmanFord.bellmanFord(graph)
  assert(result.negativeCycle === false)

  getShortestPath(result.bestFrom, Nodes.A, Nodes.A) // [Nodes.A]
  getShortestPath(result.bestFrom, Nodes.A, Nodes.B) // [Nodes.A, Nodes.B]
  getShortestPath(result.bestFrom, Nodes.A, Nodes.C) // [Nodes.A, Nodes.B, Nodes.C]
  getShortestPath(result.bestFrom, Nodes.A, Nodes.D) // [Nodes.A, Nodes.B, Nodes.C, Nodes.D])
  ```

* A solution for leetcode "Number of Ways to Arrive at Destination"
  (https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/):

  ```typescript
  import type { IBellmanFordEdge, IBellmanFordGraph } from '@algorithm.ts/bellman-ford'
  import { bellmanFord } from '@algorithm.ts/bellman-ford'

  const MOD = 1e9 + 7
  export function countPaths(N: number, roads: number[][]): number {
    const edges: Array<IBellmanFordEdge<number>> = []
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
    const graph: IBellmanFordGraph<number> = { N, source: target, edges, G }
    const result = bellmanFord(graph, { INF: 1e12 })
    if (result.hasNegativeCycle) return -1

    const { dist } = result
    const dp: number[] = new Array(N).fill(-1)
    return dfs(source)

    function dfs(o: number): number {
      if (o === target) return 1

      let answer = dp[o]
      if (answer !== -1) return answer

      answer = 0
      const d = dist[o]
      for (const idx of G[o]) {
        const e: IBellmanFordEdge<number> = edges[idx]
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

* 《算法竞赛入门经典（第2版）》（刘汝佳）： P363 Bellman-Ford 算法
* [bellman-ford | Wikipedia][wikipedia-bellman-ford]
* [@algorithm.ts/queue][]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/bellman-ford@3.1.0/packages/bellman-ford#readme
[wikipedia-bellman-ford]: https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm
[@algorithm.ts/queue]: https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/queue@3.1.0/packages/queue
