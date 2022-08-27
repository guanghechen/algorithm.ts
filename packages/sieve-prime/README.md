<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/sieve-prime#readme">@algorithm.ts/sieve-prime</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/sieve-prime">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/sieve-prime.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/sieve-prime">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/sieve-prime.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/sieve-prime">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/sieve-prime.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/sieve-prime"
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


A typescript implementation of the **Linear Sieve** algorithm for prime numbers.

If you are curious about this algorithm, you can visit [here][sieve-prime] for more details.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/sieve-prime
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/sieve-prime
  ```

* deno

  ```typescript
  import sievePrime from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/sieve-prime/src/index.ts'
  ```

## Usage

* Get all prime numbers in the range $[2, N)$:

  ```typescript
  import sievePrime from '@algorithm.ts/sieve-prime'

  sievePrime(5)   // => [2, 3]
  sievePrime(6)   // => [2, 3, 5]
  sievePrime(10)   // => [2, 3, 5, 7]
  ```


## Related

* [数论基础之筛法][sieve-prime]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/sieve-prime#readme
[sieve-prime]: https://me.guanghechen.com/post/math/number-theory/sieve/#heading-%E7%BA%BF%E6%80%A7%E7%AD%9B