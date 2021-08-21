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


[中文文档](./README-zh.md)

并查集的 Typescript 实现。关于并查集的定义可参考 [Disjoint-set data structure | Wikipedia][wiki-find-set].

并查集是一个数据结构，用于维护一个森林中的节点关系，可以在均摊常数时间复杂度
下执行下述操作：

1. 判断两个节点是否处于同义棵树中
2. 合并两棵树


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

* 创建一个普通并查集：

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

* 创建一个启发式并查集：

  启发式并查集在普通并查集的基础上维护了每棵树的节点个数，在合并树时，始终采
  用节点数多的那棵的根节点作为新树的根节点，这样可以降低后续查询的执行次数。


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
