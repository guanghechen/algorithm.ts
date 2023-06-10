<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/calculator@3.1.1/packages/calculator#readme">@algorithm.ts/calculator</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/calculator">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/calculator.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/calculator">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/calculator.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/calculator">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/calculator.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/calculator"
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


A tiny calculator for number arithmetics such as `+-*/()`.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/calculator
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/calculator
  ```


## Usage


```typescript
// Perform integer arithmetics.
import calculator from 'algorithm.ts/calculator'
// or 
import { calculator } from 'algorithm.ts/calculator'

// Perform decimal arithmetics.
import { decimalCalculator } from 'algorithm.ts/calculator'

// Perform bigint arithmetics.
import { bigintCalculator } from 'algorithm.ts/calculator'
```


## Examples

* integer arithmetics

  ```typescript
  import calculator from '@algorithm.ts/calculator'

  calculator.calculate('3/2')                  // => 1
  calculator.calculate('-2+1')                 // => -1
  calculator.calculate('-2*3 + 2*5*3/6')       // => -1
  calculator.calculate('(1+(4+5+2)-3)+(6+8)')  // => 23
  ```

* decimal arithmetics

  ```typescript
  import { decimalCalculator as calculator } from '@algorithm.ts/calculator'

  calculator.calculate('3/2')                  // => 1.5
  calculator.calculate('-2+1')                 // => -1
  calculator.calculate('-2*3 + 2*5*3/6')       // => -1
  calculator.calculate('(1+(4+5+2)-3)+(6+8)')  // => 23
  ```

* bigint arithmetics

  ```typescript
  import { bigintCalculator as calculator } from '@algorithm.ts/calculator'

  calculator.calculate('22222222222222222222222222222 * 3333333333333333333323232')
  // => 74074074074074074073849599999259259259259259259261504n
  ```

* Illegal inputs

  ```typescript
  import calculator from '@algorithm.ts/calculator'

  calculator.calculate('-2++1')      // => SyntaxError
  calculator.calculate('-2*/23')     // => SyntaxError
  calculator.calculate('1+(4+5+2))') // => SyntaxError
  calculator.calculate('1+(4+5+2')   // => SyntaxError
  ```

* A solution of https://leetcode.com/problems/basic-calculator/

  ```typescript
  import calculator from '@algorithm.ts/calculator'
  export function calculate(expression: string): number {
    return calculator.calculate(expression)
  }
  ```

* A solution of https://leetcode.com/problems/basic-calculator-ii/

  ```typescript
  import calculator from '@algorithm.ts/calculator'
  export function calculate(expression: string): number {
    return calculator.calculate(expression)
  }
  ```

## Related

* [编译原理-语法制导翻译实现计算器][calculate]


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/release-3.x.x/packages/calculate#readme
[calculate]: https://me.guanghechen.com/post/fundamentals-of-compiling/exercise/
