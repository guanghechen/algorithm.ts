<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/bipartite-matching@4.0.3/packages/bipartite-matching#readme">@algorithm.ts/bipartite-matching</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/bipartite-matching">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/bipartite-matching.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/bipartite-matching">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/bipartite-matching.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/bipartite-matching">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/bipartite-matching.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/bipartite-matching"
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

A typescript implementation of the algorithm to find the maximum [matching][wikipedia-matching] of
the [bipartite graph][wikipedia-bipartite-graph].

The following definition is quoted from Wikipedia
(https://en.wikipedia.org/wiki/Matching_(graph_theory)):

> A maximal matching is a matching $M$ of a graph $G$ that is not a subset of any other matching. A
> matching $M$ of a graph $G$ is maximal if every edge in $G$ has a non-empty intersection with at
> least one edge in $M$.
>
> A maximum matching (also known as maximum-cardinality matching) is a matching that contains the
> largest possible number of edges. There may be many maximum matchings. The matching number
> $\displaystyle \nu (G)$ of a graph $G$ is the size of a maximum matching. Every maximum matching
> is maximal, but not every maximal matching is a maximum matching. The following figure shows
> examples of maximum matchings in the same three graphs.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/bipartite-matching
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/bipartite-matching
  ```

## Usage

- Simple

  ```typescript
  import type { IBipartiteMatcher } from '@algorithm.ts/bipartite-matching'
  import { HungarianDfs } from '@algorithm.ts/bipartite-matching'

  const matcher: IBipartiteMatcher = new HungarianDfs()
  matching.init(4)
  matching.maxMatch() // => 0

  matching.addEdge(0, 1)
  matching.addEdge(0, 2)
  matching.addEdge(0, 3)
  matching.maxMatch() // => 1

  matching.addEdge(2, 3)
  matching.maxMatch() // => 2
  ```

## Example

- A solution for leetcode "Maximum Students Taking Exam"
  (https://leetcode.com/problems/maximum-students-taking-exam/):

  ```typescript
  import type { IBipartiteMatcher } from '@algorithm.ts/bipartite-matching'
  import { HungarianDfs } from '@algorithm.ts/bipartite-matching'

  const matcher: IBipartiteMatcher = new HungarianDfs()
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
        if (seats[r][c] === '.') {
          seatCodes[r][c] = total
          total += 1
        }
      }
    }

    if (total <= 0) return 0
    if (total === 1) return 1

    matcher.init(total)
    for (let r = 0; r < R; ++r) {
      for (let c = 0; c < C; ++c) {
        const u: number = seatCodes[r][c]
        if (u > -1) {
          if (r > 0) {
            // Check upper left
            if (c > 0 && seatCodes[r - 1][c - 1] > -1) {
              matcher.addEdge(u, seatCodes[r - 1][c - 1])
            }

            // Check upper right
            if (c + 1 < C && seatCodes[r - 1][c + 1] > -1) {
              matcher.addEdge(u, seatCodes[r - 1][c + 1])
            }
          }

          // Check left
          if (c > 0 && seatCodes[r][c - 1] > -1) {
            matcher.addEdge(u, seatCodes[r][c - 1])
          }
        }
      }
    }

    const totalPaired: number = matcher.maxMatch().count
    return total - totalPaired
  }
  ```

## Related

- 《算法竞赛入门经典（第 2 版）》（刘汝佳）： P347-P348 二分图最大匹配
- [二分图 | 光和尘][bipartite-graph]
- [Bipartite graph | Wikipedia][wikipedia-bipartite-graph]
- [Matching (graph theory) | Wikipedia][wikipedia-matching]

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/bipartite-matching@4.0.3/packages/bipartite-matching#readme
[wikipedia-bipartite-graph]: https://en.wikipedia.org/wiki/Bipartite_graph
[wikipedia-matching]: https://en.wikipedia.org/wiki/Matching_(graph_theory)
[bipartite-graph]: https://me.guanghechen.com/post/algorithm/graph/bipartite-graph/
