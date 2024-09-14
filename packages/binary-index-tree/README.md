<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/binary-index-tree@4.0.2/packages/binary-index-tree#readme">@algorithm.ts/binary-index-tree</a>
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

The Binary Index Tree is a tree-shaped array structure used to efficiently maintain the prefix sum.
There are usually two modes of operation:

1. Single point update, interval query. Modify the value of an element in the number sequence, and
   solve the prefix sum at a certain position. Solve the sum of any interval $[L, R]$ can be divided
   into the sum of interval $[1,R]$ and the sum of interval $[1, L-1]$, then perform a subtraction
   operation.

2. Interval update, single-point query. Add a value to the value of the first $x$ elements in the
   sequence, and solve the current value of the element at any position in the sequence. Similarly,
   if you want to add a common value $x$ to any interval $[L, R]$, you can first add $x$ to all
   elements in [1,R], and then add $-x$ to all elements in [1,L-1].

The above operations are all done under the amortized complexity of $O(\log N)$.

The problem that the Binary Index Tree can solve is a subset of the Segment Tree. But the complexity
constant of Binary Index Tree is smaller, and its implementation is simpler and easier to
understand.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/binary-index-tree
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/binary-index-tree
  ```

## Usage

### Single-point update And interval query

- Solve numbers:

  ```typescript {3}
  import { SingleUpdateIntervalQuery } from '@algorithm.ts/binary-index-tree'

  const MAX_N = 10
  const bit = new SingleUpdateIntervalQuery<number>({
    operator: {
      ZERO: 0,
      add: (x, y) => x + y
    }
  })
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

- Solve bigint:

  ```typescript {6}
  import { SingleUpdateIntervalQuery } from '@algorithm.ts/binary-index-tree'

  const MAX_N = 10
  const bit = new SingleUpdateIntervalQuery<bigint>({
    operator: {
      ZERO: 0n,
      add: (x, y) => x + y
    }
  })
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

- Solve numbers:

  ```typescript {3}
  import { IntervalUpdateSingleQuery } from '@algorithm.ts/binary-index-tree'

  const MAX_N = 10
  const bit = new IntervalUpdateSingleQuery<number>({
    operator: {
      ZERO: 0,
      add: (x, y) => x + y
    }
  })
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

- Solve bigint:

  ```typescript {6}
  import { IntervalUpdateSingleQuery } from '@algorithm.ts/binary-index-tree'

  const MAX_N = 10
  const bit = new IntervalUpdateSingleQuery<number>({
    operator: {
      ZERO: 0n,
      add: (x, y) => x + y
    }
  })
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

- With Mod

  ```typescript
  import { SingleUpdateIntervalQuery } from '@algorithm.ts/binary-index-tree'

  const MOD = 1e9 + 7
  const bit = SingleUpdateIntervalQuery<number>({
    operator: {
      ZERO: 0,
      add: (x, y) => {
        const z = x + y
        return z >= MOD ? z - MOD : z < 0 ? z + MOD : z
      },
    },
  })

  bit.init(1e5 + 10)
  bit.add(2, <value>)   // <value> should in the range of (-MOD, MOD)
  bit.query(3)
  ```

  ```typescript
  import { IntervalUpdateSingleQuery } from '@algorithm.ts/binary-index-tree'

  const MOD = BigInt(1e9 + 7)
  const bit = new IntervalUpdateSingleQuery<bigint>({
    operator: {
      ZERO: 0n,
      add: (x, y) => {
        const z = x + y
        return z >= MOD ? z - MOD : z < 0n ? z + MOD : z
      },
    },
  })

  bit.init(1e5 + 10)
  bit.add(2, <value>)   // <value> should in the range of (-MOD, MOD)
  bit.query(3)
  ```

## Related

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/binary-index-tree@4.0.2/packages/binary-index-tree#readme
[binary-index-tree]: https://me.guanghechen.com/post/algorithm/shuffle/#heading-binary-index-tree
