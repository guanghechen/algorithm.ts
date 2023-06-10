<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/gcd@3.1.1/packages/gcd#readme">@algorithm.ts/gcd</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/gcd">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/gcd.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/gcd">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/gcd.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/gcd">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/gcd.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/gcd"
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


A typescript implementation of the **gcd** and **Extended Euclidean** algorithm.

* gcd: The Greatest Common Divisor.

* Extended Euclidean algorithm: For solving the smallest
  integer solution (|x| + |y| smallest) of the equation `Ax + By = gcd(x,y)`.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/gcd
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/gcd
  ```


## Usage

* gcd

  ```typescript
  import { gcd, gcdBigint } from '@algorithm.ts/gcd'

  gcd(3, 4) // => 1
  gcdBigint(3n, 6n) // => 3n
  ```

* Extended Euclidean algorithm

  ```typescript
  import { euclidean, euclideanBigint } from '@algorithm.ts/gcd'

  // 3x + 4y = gcd(3, 4)
  euclidean(3, 4) // => [-1, 1, 1]
  euclidean(3, 8) // => [3, -1, 1]
  euclideanBigint(6, 8) // => [-1n, 1n, 2n]
  ```

## Related


* [数论基础之模方程初步][gcd]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/gcd@3.1.1/packages/gcd#readme
[gcd]: https://me.guanghechen.com/post/math/number-theory/%E6%A8%A1%E6%96%B9%E7%A8%8B/basic/
