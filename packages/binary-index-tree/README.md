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


A typescript implementation of the **Binary Index Tree**.

A Binary Index tree is a tree array, used to efficiently maintain the prefix
sum. Such as support single point update with interval query, or interval
update with single point query. The amortized complexity of each operation is
$O(log N)$.

The problem that the Binary Index Tree can solve is a subset of the Segment
Tree. Its advantage is that the complexity constant is smaller, and the
implementation is simpler and easier to understand.


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

### Single-point update And interval query

* Solve numbers:

  ```typescript {3}
  import { createBinaryIndexTree1 } from '@algorithm.ts/binary-index-tree'

  const MAX_N = 10
  const bit = createBinaryIndexTree1<number>(MAX_N, 0)
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
  // Please note that the second parameter is `0n`, which represents the zero
  // element of bigint, and 0 is passed-in in the above example.
  const bit = createBinaryIndexTree1<number>(MAX_N, 0n) 
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

### Interval update and single-point query

* Solve numbers:

  ```typescript {3}
  import { createBinaryIndexTree2 } from '@algorithm.ts/binary-index-tree'

  const MAX_N = 10
  const bit = createBinaryIndexTree2<number>(MAX_N, 0)
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
  // Please note that the second parameter is `0n`, which represents the zero
  // element of bigint, and 0 is passed-in in the above example.
  const bit = createBinaryIndexTree2<number>(MAX_N, 0n)
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