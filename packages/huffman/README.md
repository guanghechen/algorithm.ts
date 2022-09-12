<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/release-3.x.x/packages/huffman#readme">@algorithm.ts/huffman</a>
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
  import { decode, fromEncodingTable } from '@algorithm.ts/huffman'

  const plaintext = decode(encodedData, tree)

  // Or build tree from encodingTable
  const tree2 = fromEncodingTable(encodingTable)
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


## Example

* Compress uri data

  ```typescript
  const data = { name: 'alice', age: 33, gender: 'female' }

  compress(JSON.stringify(data))
  // => 'WyIzIiwyMCwiLCIsMTYsIn0iLDM0LCJpIiwzNSwiZyIsMTgsIm4iLDE5LCJsIiwyMSwiciIsNDQsImMiLDkwLCJkIiw5MSwiOiIsMjMsIlwiIiw2LCJlIiwxNCwiYSIsMzAsInsiLDEyNCwiZiIsMTI1LCJtIiw2M10_-BvI)(p7lG1oLi06IEWNvMnvd(l0C'

  decompress('WyIzIiwyMCwiLCIsMTYsIn0iLDM0LCJpIiwzNSwiZyIsMTgsIm4iLDE5LCJsIiwyMSwiciIsNDQsImMiLDkwLCJkIiw5MSwiOiIsMjMsIlwiIiw2LCJlIiwxNCwiYSIsMzAsInsiLDEyNCwiZiIsMTI1LCJtIiw2M10_-BvI)(p7lG1oLi06IEWNvMnvd(l0C')
  // => '{"name":"alice","age":33,"gender":"female"}'

  function compress(text) {
    const { encodedData, encodingTable } = huffman.encode(text)
    const cipherBuffer = huffman.compress(encodedData)
    const cipherText = base64.encode(cipherBuffer)

    const textEncoder = new TextEncoder('utf-8')
    const encodingTableText = base64.encode(
      textEncoder.encode(JSON.stringify(compressEncodingTable(encodingTable))),
    )
    const result = (encodingTableText + '-' + cipherText)
      .replace(/\//g, '(')
      .replace(/\+/g, ')')
      .replace(/=/g, '_')
    return result
  }

  function decompress(text) {
    const [encodingTableText, cipherText] = text
      .replace(/\(/g, '/')
      .replace(/\)/g, '+')
      .replace(/_/g, '=')
      .split('-')
    const textDecoder = new TextDecoder('utf-8')
    const encodingTable = decompressEncodingTable(
      JSON.parse(textDecoder.decode(base64.decode(encodingTableText))),
    )
    const tree = huffman.fromEncodingTable(encodingTable)

    const cipherData = huffman.decompress(base64.decode(cipherText))
    const plaintext = huffman.decode(cipherData, tree)
    return plaintext
  }

  function compressEncodingTable(table) {
    const entries = Object.entries(table)
      .map(([value, path]) => {
        let p = 1
        for (const x of path) p = (p << 1) | x
        return [value, p]
      })
      .flat()
    return entries
  }

  function decompressEncodingTable(entries) {
    const table = {}
    for (let i = 0; i < entries.length; i += 2) {
      const value = entries[i]
      const p = entries[i + 1]
      const path = []
      for (let x = p; x > 1; x >>= 1) path.push(x & 1)
      table[value] = path.reverse()
    }
    return table
  }
  ```


## Related

* [Huffman coding | Wikipedia](https://en.wikipedia.org/wiki/Huffman_coding)


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/release-3.x.x/packages/huffman#readme
