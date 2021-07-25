<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/knuth-shuffle#readme">@guanghechen/knuth-shuffle</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@guanghechen/knuth-shuffle">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@guanghechen/knuth-shuffle.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@guanghechen/knuth-shuffle">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@guanghechen/knuth-shuffle.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@guanghechen/knuth-shuffle">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@guanghechen/knuth-shuffle.svg"
      />
    </a>
    <a href="#install">
      <img
        alt="Module Formats: cjs"
        src="https://img.shields.io/badge/module_formats-cjs-green.svg"
      />
    </a>
    <a href="https://github.com/nodejs/node">
      <img
        alt="Node.js Version"
        src="https://img.shields.io/node/v/@guanghechen/knuth-shuffle"
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

Knuth-Shuffle is a shuffle algorithm, which can complete the shuffle in $O(N)$
time complexity on the basis of only using a constant level of extra space.

If you are interested in this algorithm, you can check [here][knuth-shuffle].


## Install

* npm

  ```bash
  npm install --save @guanghechen/knuth-shuffle
  ```

* yarn

  ```bash
  yarn add @guanghechen/knuth-shuffle
  ```

## Usage

* Shuffle nums.

  ```typescript
  import knuthShuffle from '@guanghechen/knuth-shuffle'

  knuthShuffle([1, 2, 3, 4, 5])
  ```

* Shuffle complex data nodes.

  ```typescript
  import knuthShuffle from '@guanghechen/knuth-shuffle'

  interface Node {
    name: string
    email: string
    age: number
  }

  const nodes: Node[] = [/*... omit ...*/]
  knuthShuffle(nodes)
  ```

## Related

* [洗牌问题和 knuth-shuffle 算法][knuth-shuffle]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/knuth-shuffle#readme
[knuth-shuffle]: https://me.guanghechen.com/post/algorithm/shuffle/#heading-knuth-shuffle