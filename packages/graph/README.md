<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/graph@4.0.3/packages/graph#readme">@algorithm.ts/graph</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/graph">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/graph.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/graph">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/graph.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/graph">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/graph.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/graph"
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

Types and utils from solving graph problems.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/graph
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/graph
  ```

## Usage

- `buildEdgeMap`

  ```typescript {17}
  import { buildEdgeMap } from '@algorithm.ts/graph'
  import type { IDigraph, IDigraphEdge } from '@algorithm.ts/graph.types'

  interface IEdge extends IDigraphEdge {
    from: number
    cost: number
  }

  const Nodes = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
  }
  const N: number = Object.keys(Nodes).length
  const edges: IEdge[] = [
    { from: Nodes.A, to: Nodes.B, cost: 1 }, // A-B (1)
    { from: Nodes.B, to: Nodes.A, cost: -1 }, // B-A (-1)
    { from: Nodes.B, to: Nodes.C, cost: 0.87 }, // B-C (0.87)
    { from: Nodes.C, to: Nodes.B, cost: -0.87 }, // C-B (-0.87)
    { from: Nodes.C, to: Nodes.D, cost: 5 }, // C-D (5)
    { from: Nodes.D, to: Nodes.C, cost: -5 }, // D-C (-5)
  ]
  const G: number[][] = buildEdgeMap(N, edges)
  const graph: IDigraph<IEdge> = { N, G, edges }
  ```

- `getShortestPath`

  ```typescript {17}
  import { getShortestPath } from '@algorithm.ts/graph'

  /**
   * @param bestFrom  Record the shortest path parent source point to the specified point.
   * @param source    The source node on the shortest path.
   * @param target    The target node on the shortest path.
   */
  getShortestPath(bestFrom: number[], source: number, target: number): number[] // nodes
  ```

## Related

- [@algorithm.ts/bellman-ford][]
- [@algorithm.ts/dijkstra][]

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/graph@4.0.3/packages/graph#readme
[@algorithm.ts/bellman-ford]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/bellman-ford@4.0.3/packages/bellman-ford
[@algorithm.ts/dijkstra]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/dijkstra@4.0.3/packages/dijkstra
