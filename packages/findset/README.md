<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/findset#readme">@algorithm.ts/findset</a>
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
  import { createFindSet } from '@algorithm.ts/findset'

  const findset = createFindSet()

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
  import { createHeuristicFindSet } from '@algorithm.ts/findset'

  const findset = createHeuristicFindSet()

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


## Related

* [Disjoint-set data structure | Wikipedia][wiki-find-set]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/findset#readme
[wiki-find-set]: https://en.wikipedia.org/wiki/Disjoint-set_data_structure
