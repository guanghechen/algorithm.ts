<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/release-3.x.x/packages/types#readme">@algorithm.ts/types</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/types">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/types.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/types">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/types.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/types">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/types.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/types"
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


Common types.

## Install

* npm

  ```bash
  npm install --save @algorithm.ts/types
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/types
  ```


## Usage

### ICollection

Signature               |  Description
:-----------------------|:------------------------------------------------------------------------
`readonly size: number` | Count the element in the collection. 
`destroy(): void`       | Release memory.
`clear(): void`         | Remove all elements. (Notice that this method does not release memory)


## Related


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/release-3.x.x/packages/types#readme
