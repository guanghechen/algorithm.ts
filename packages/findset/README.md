<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/findset#readme">@algorithm.ts/findset</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/findset">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/findset.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/findset">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/findset.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/findset">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/findset.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/findset"
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


A typescript implementation of the **Findset** data structure, usually also
known as [Disjoint-set data structure][wiki-find-set].

The find-set is a data structure used to maintain the node relationship in a
forest. Find set support to perform the following operations under the
amortized constant time complexity:

1. Determine whether two nodes are in a synonymous tree.
2. Merge two trees.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/findset
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/findset
  ```

## Usage

* Create a ordinary findset:

  ```typescript
  import { createFindset } from '@algorithm.ts/findset'

  const findset = createFindset()

  // Initialize the findset with 1000 node.
  findset.init(1000)

  // Find the root node of the tree where the given node located.
  // !!!Attention. The node number must be a positive integer in range of [1, 1000]
  findset.root(4)   // => 4

  // Merge two trees.
  findset.merge(2, 3)

  assert(findset.root(2) === findset.root(3))
  ```

* Create a heuristic findset:

  The heuristic find-set maintains the number of nodes of each tree on the basis
  of the ordinary version. When merging trees, always use the root node of the
  tree with more nodes as the root node of the new tree, which can reduce the
  number of executions of subsequent queries.

  ```typescript
  import { createHeuristicFindset } from '@algorithm.ts/findset'

  const findset = createHeuristicFindset()

  // Initialize the findset with 1000 node.
  findset.init(1000)

  // Find the root node of the tree where the given node located.
  // !!!Attention. The node number must be a positive integer in range of [1, 1000]
  findset.root(4)   // => 4

  // Merge two trees.
  findset.merge(2, 3)

  assert(findset.root(2) === findset.root(3))

  // Count the nodes of a tree.
  findset.size(1)   // => 1
  findset.size(2)   // => 2
  findset.size(3)   // => 2
  findset.size(4)   // => 1
  ```

* Create an enhanced findset:

  On the basis of ordinary findset, this enhanced version also supports to get
  all the nodes on a given tree (access through the root node).

  ```typescript
  import { createEnhancedFindset } from '@algorithm.ts/findset'

  const findset = createEnhancedFindset(100)

  findset.init(100)
  findset.size(1)       // => 1
  findset.merge(1, 2)
  findset.size(1)       // => 2
  findset.size(2)       // => 2
  findset.getSetOf(1)   // => Set {1, 2}
  findset.getSetOf(2)   // => Set {1, 2}
  ```

### Example

* A solution for leetcode "Find All People With Secret"
  (https://leetcode.com/problems/find-all-people-with-secret/):

  ```typescript
  import { createEnhancedFindset } from '@algorithm.ts/findset'
  import type { IEnhancedFindset } from '@algorithm.ts/findset'

  const MAX_N = 1e5 + 10
  const answer: Set<number> = new Set()
  const nodes: Set<number> = new Set()
  const visited: Uint8Array = new Uint8Array(MAX_N)
  const findset: IEnhancedFindset = createEnhancedFindset(MAX_N)

  export function findAllPeople(N: number, meetings: number[][], firstPerson: number): number[] {
    const M: number = meetings.length

    answer.clear()
    answer.add(1)
    answer.add(firstPerson + 1)

    meetings
      .sort((x, y) => x[2] - y[2])
      .forEach(item => {
        item[0] += 1
        item[1] += 1
      })

    for (let i = 0, j: number; i < M; i = j) {
      const t: number = meetings[i][2]
      for (j = i + 1; j < M; ++j) {
        if (meetings[j][2] !== t) break
      }

      nodes.clear()
      for (let k = i; k < j; ++k) {
        const [x, y] = meetings[k]
        nodes.add(x)
        nodes.add(y)
      }

      for (const x of nodes) {
        findset.initNode(x)
        visited[x] = 0
      }

      for (let k = i; k < j; ++k) {
        const [x, y] = meetings[k]
        findset.merge(x, y)
      }

      for (const x of nodes) {
        if (!answer.has(x)) continue

        const xx: number = findset.root(x)
        if (visited[xx]) continue
        visited[xx] = 1

        const xxSet: Set<number> = findset.getSetOf(xx)!
        for (const t of xxSet) answer.add(t)
      }
    }

    return Array.from(answer)
      .map(x => x - 1)
      .sort((x, y) => x - y)
  }
  ```

## Related

* [Disjoint-set data structure | Wikipedia][wiki-find-set]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/findset#readme
[wiki-find-set]: https://en.wikipedia.org/wiki/Disjoint-set_data_structure
