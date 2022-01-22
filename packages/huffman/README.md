<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/huffman#readme">@algorithm.ts/huffman</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/huffman">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/huffman.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/huffman">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/huffman.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/huffman">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/huffman.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/huffman"
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


A typescript implementation of the **huffman** coding.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/huffman
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/huffman
  ```


## Usage

* `encode`: Encode text to Uint8Array and a huffman tree.

  ```typescript
  import { encode } from '@algorithm.ts/huffman'

  const { encodedData, encodingTable, tree } = encode('Hello, world!')
  ```

* `decode`: Decode a huffman encoded data to string.

  ```typescript
  import { decode } from '@algorithm.ts/huffman'

  const plaintext = decode(encodedData, tree)

  // Or build tree from encodingTable
  const tree2 = buildHuffmanTree(encodingTable)
  const plaintext2 = decode(encodedData, tree2)
  ```

* `compress`: Compress the encoded data.

  ```typescript
  // Array<0 | 1> ==> Uint8Array
  const compressedData = compress(encodedData)
  ```

* `decompress`: Decompress data.

  ```typescript
  // Uint8Array ==> Array<0 | 1>
  const encodedData2 = decompress(compressedData)
  ```


## Related

* [Huffman coding | Wikipedia](https://en.wikipedia.org/wiki/Huffman_coding)


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/huffman#readme
