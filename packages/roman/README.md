<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/roman@4.0.1/packages/roman#readme">@algorithm.ts/roman</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/roman">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/roman.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/roman">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/roman.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/roman">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/roman.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/roman"
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

This package is written to support the mutual conversion between Roman numerals and Arabic numerals.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/roman
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/roman
  ```

## Usage

- `int2roman`: Convert an Arabic numeral into a Roman numeral representation.

  ```typescript
  import { int2roman } from '@algorithm.ts/roman'

  int2roman(1)    // => 'I'
  int2roman(4)    // => 'IV'
  int2roman(9)    // => 'IX'
  int2roman(1437) // => 'MCDXXXVII'
  int2roman(3999) // => 'MMMCMXCIX'

  // Out of range
  int2roman(4000) // => An TypeError will be thrown
  ```

- `roman2int`: Convert an Roman numeral into a Arabic numeral representation.

  ```typescript
  import { roman2int } from '@algorithm.ts/roman'

  roman2int('I')          // => 1
  roman2int('IV')         // => 4
  roman2int('IX')         // => 9
  roman2int('MCDXXXVII')  // => 1437
  roman2int('MMMCMXCIX')  // => 3999
  ```

## Related

- [Roman numerals | Wikipedia](https://en.wikipedia.org/wiki/Roman_numerals)

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/roman@4.0.1/packages/roman#readme
