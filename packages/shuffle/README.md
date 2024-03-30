<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/shuffle@4.0.0/packages/shuffle#readme">@algorithm.ts/shuffle</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/shuffle">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/shuffle.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/shuffle">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/shuffle.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/shuffle">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/shuffle.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/shuffle"
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

A typescript implementation of the **Knuth-Shuffle** algorithm.

Knuth-Shuffle is a shuffle algorithm, which can complete the shuffle in $O(N)$ time complexity on
the basis of only using a constant level of extra space.

If you are curious about this algorithm, you can visit [here][knuth-shuffle] for more details.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/shuffle
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/shuffle
  ```

## Usage

- Shuffle nums.

  ```typescript
  import { knuthShuffle } from '@algorithm.ts/shuffle'

  knuthShuffle([1, 2, 3, 4, 5])
  ```

- Shuffle complex data nodes.

  ```typescript
  import { knuthShuffle } from '@algorithm.ts/shuffle'

  interface Node {
    name: string
    email: string
    age: number
  }

  const nodes: Node[] = [
    { name: 'alice', email: 'alice@gmail.com', age: 40 },
    /*... omit ...*/
    { name: 'bob', email: 'lob@gmail.com', age: 40 },
  ]
  knuthShuffle(nodes)
  ```

- Shuffle the elements which indexes in the customized contiguous range.

  ```typescript
  import { knuthShuffle } from '@algorithm.ts/shuffle'

  // shuffle { a[2], a[3], a[4], a[5], a[6] }
  knuthShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], 2, 7)
  ```

## Related

- [洗牌问题和 shuffle 算法][knuth-shuffle]

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/shuffle@4.0.0/packages/shuffle#readme
[knuth-shuffle]: https://me.guanghechen.com/post/algorithm/shuffle/#heading-knuth-shuffle
