<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/calculate#readme">@algorithm.ts/calculate</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/calculate">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/calculate.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/calculate">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/calculate.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/calculate">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/calculate.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/calculate"
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


A tiny calculator for integer arithmetics such as `+-*/()`.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/calculate
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/calculate
  ```

* deno

  ```typescript
  import calculate from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/calculate/src/index.ts'
  ```


## Usage

* Basic

  ```typescript
  import calculate from '@algorithm.ts/calculate'

  calculate('-2+1')                 // => -1
  calculate('-2*3 + 2*5*3/6')       // => -1
  calculate('(1+(4+5+2)-3)+(6+8)')  // => 23
  ```

* Illegal inputs

  ```typescript
  import calculate from '@algorithm.ts/calculate'

  calculate('-2++1')      // => NaN
  calculate('-2*/23')     // => NaN
  calculate('1+(4+5+2))') // => NaN
  calculate('1+(4+5+2')   // => NaN
  ```

* A solution of https://leetcode.com/problems/basic-calculator/

  ```typescript
  export { calculate } from '@algorithm.ts/calculate'
  ```

## Related

* [编译原理-语法制导翻译实现计算器][calculate]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/calculate#readme
[calculate]: https://me.guanghechen.com/post/fundamentals-of-compiling/exercise/