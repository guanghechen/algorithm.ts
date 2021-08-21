<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/binary-index-tree#readme">@algorithm.ts/binary-index-tree</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/binary-index-tree">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/binary-index-tree.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/binary-index-tree">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/binary-index-tree.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/binary-index-tree">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/binary-index-tree.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/binary-index-tree"
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


**树状数组** 的 Typescript 实现。

树状数组是一个树形的数组结构，用于高效地维护前缀和。通常有两种操作方式：

1. 单点更新，区间查询： 修改数列中某个元素的数值，以及求解某个位置开始的前缀和；
   求解任意区间 $[L, R]$ 的和可以拆成求解区间 $[1,R]$ 的和与区间 $[1,L-1]$ 的和
   之差，即转换成求解两个前缀和的问题。

2. 区间更新，单点查询： 给数列中前 $x$ 个元素的值同时加上某个值，以及求解数列中
   任意位置上的元素当前值。同样地，如果要给任意区间 $[L, R]$ 加上一个共同的值 $x$，
   可以先给 $[1,R]$ 中的元素同时加上 $x$，再给 $[1,L-1]$ 中的元素同时加上 $-x$。

上述操作全是在 $O(\log N)$ 的均摊复杂度下完成。

树状数组能解决的问题是线段树的子集，但是其相比于线段树拥有更小的复杂度常数，以及
更简单的实现且更易理解。


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/binary-index-tree
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/binary-index-tree
  ```

## Usage

### 单点更新，区间查询

* Solve numbers:

  ```typescript {3}
  import { createBinaryIndexTree1 } from '@algorithm.ts/binary-index-tree'

  const MAX_N = 10
  const bit = createBinaryIndexTree1<number>(0)
  bit.init(MAX_N)

  // Add 10 on the 2th element.
  bit.add(2, 10)

  // Get the prefix sums.
  bit.query(1) // => 0
  bit.query(2) // => 10
  bit.query(/* any integer between [2, 10] */) // => 10

  // Add 7 on the 4th element.
  bit.add(4, 7)

  // Get the prefix sums.
  bit.query(1) // => 0
  bit.query(2) // => 10
  bit.query(3) // => 10
  bit.query(4) // => 17
  bit.query(/* any integer between [4, 10] */) // => 17
  ```

* Solve bigint:

  ```typescript {6}
  import { createBinaryIndexTree1 } from '@algorithm.ts/binary-index-tree'

  const MAX_N = 10
  // Please note that the first parameter is `0n`, which represents the zero
  // element of bigint, and 0 is passed-in in the above example.
  const bit = createBinaryIndexTree1<number>(0n) 
  bit.init(MAX_N)

  // Add 10n on the 2th element.
  bit.add(2, 10n)

  // Get the prefix sums.
  bit.query(1) // => 0n
  bit.query(2) // => 10n
  bit.query(/* any integer between [2, 10] */) // => 10n

  // Add 7n on the 4th element.
  bit.add(4, 7)

  // Get the prefix sums.
  bit.query(1) // => 0n
  bit.query(2) // => 10n
  bit.query(3) // => 10n
  bit.query(4) // => 17n
  bit.query(/* any integer between [4, 10] */) // => 17n
  ```

### 区间更新，单点查询

* Solve numbers:

  ```typescript {3}
  import { createBinaryIndexTree2 } from '@algorithm.ts/binary-index-tree'

  const MAX_N = 10
  const bit = createBinaryIndexTree2<number>(0)
  bit.init(MAX_N)

  // Add 10 on the first two elements.
  bit.add(2, 10)

  // Get the value of x-st element.
  bit.query(1) // => 10
  bit.query(2) // => 10
  bit.query(/* any integer between [3, 10] */) // => 0

  // Add 7 on the first four elements.
  bit.add(4, 7)

  // Get the value of x-st element.
  bit.query(1) // => 17
  bit.query(2) // => 17
  bit.query(3) // => 17
  bit.query(4) // => 17
  bit.query(/* any integer between [5, 10] */) // => 0
  ```

* Solve bigint:

  ```typescript {6}
  import { createBinaryIndexTree2 } from '@algorithm.ts/binary-index-tree'

  const MAX_N = 10
  // Please note that the first parameter is `0n`, which represents the zero
  // element of bigint, and 0 is passed-in in the above example.
  const bit = createBinaryIndexTree2<number>(0n)
  bit.init(MAX_N)

  // Add 10 on the first two elements.
  bit.add(2, 10n)

  // Get the value of x-st element.
  bit.query(1) // => 10n
  bit.query(2) // => 10n
  bit.query(/* any integer between [3, 10] */) // => 0n

  // Add 7 on the first four elements.
  bit.add(4, 7)

  // Get the value of x-st element.
  bit.query(1) // => 17n
  bit.query(2) // => 17n
  bit.query(3) // => 17n
  bit.query(4) // => 17n
  bit.query(/* any integer between [5, 10] */) // => 0n
  ```


## Related


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/binary-index-tree#readme
[binary-index-tree]: https://me.guanghechen.com/post/algorithm/shuffle/#heading-binary-index-tree