<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/prime@4.0.1/packages/prime#readme">@algorithm.ts/prime</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/prime">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/prime.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/prime">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/prime.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/prime">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/prime.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/prime"
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

If you are curious about this algorithm, you can visit [here][prime] for more details.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/prime
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/prime
  ```

## Usage

- Get all prime numbers in the range $[2, N)$:

  ```typescript
  import { sievePrime } from '@algorithm.ts/prime'

  sievePrime(5)   // => [2, 3]
  sievePrime(6)   // => [2, 3, 5]
  sievePrime(10)   // => [2, 3, 5, 7]
  ```

- Get all prime numbers and totient function values in the range $[2, N)$:

  ```typescript
  import { sieveTotient } from '@algorithm.ts/prime'

  const [totients, primes] = sieveTotient(10)
  // =>
  //    totients: [0, 1, 1, 2, 2, 4, 2, 6, 4, 6]
  //    primes: [2, 3, 5, 7]
  ```

## Related

- [Euler's totient function | Wikipedia](https://en.wikipedia.org/wiki/Euler%27s_totient_function)
- [数论基础之筛法][sieve-prime]
- [数论基础之筛法 | 光和尘][sieve-totient]

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/prime@4.0.1/packages/prime#readme
[sieve-prime]:
  https://me.guanghechen.com/post/math/number-theory/sieve/#heading-%E7%BA%BF%E6%80%A7%E7%AD%9B
[sieve-totient]:
  https://me.guanghechen.com/post/math/number-theory/sieve/#heading-%E7%BA%BF%E6%80%A7%E7%AD%9B-2
