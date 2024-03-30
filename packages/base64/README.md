<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/base64@4.0.0-alpha.0/packages/base64/#readme">@algorithm.ts/base64</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/base64">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/base64.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/base64">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/base64.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/base64">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/base64.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/base64"
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

A typescript implementation of the **base64** encoding. Unlike traditional implementations, this
project uses `Uint8Array` to represent byte streams.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/base64
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/base64
  ```

## Usage

- `encode`: Encode a Uint8Array into base64 encoded string.

  ```typescript
  // node env: import { TextEncoder } from 'util'
  import { encode } from '@algorithm.ts/base64'

  const getBytes = (text: string): Uint8Array => {
    const textEncoder = new TextEncoder()
    const data: Uint8Array = textEncoder.encode(text)
    return data
  }

  encode(getBytes('Hello, world!')) // => 'SGVsbG8sIHdvcmxkIQ=='
  ```

- `decode`: Decode a base64 encoded string to Uint8Array

  ```typescript
  import { decode } from '@algorithm.ts/base64'

  const data: Uint8Array = decode('SGVsbG8sIHdvcmxkIQ==')
  const textDecoder = new TextDecoder()
  textDecoder.decode(data) // => 'Hello, world!'
  ```

- `validate`: Check if a string is base64 encoded.

  ```typescript
  validate('SGVsbG8sIHdvcmxkIQ==') // => true
  ```

- Custom code map.

  ```typescript
  // node env: import { TextEncoder } from 'util'
  import { Base64 } from '@algorithm.ts/base64'

  const getBytes = (text: string): Uint8Array => {
    const textEncoder = new TextEncoder()
    const data: Uint8Array = textEncoder.encode(text)
    return data
  }

  const base64 = new Base64({
    CODES: '#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+'
  })
  base64.encode(getBytes('Hello, world!')) // => RFUraF7rHGcublwjHP==
  ```

## Related

- BASE64 Table

  | Index | Binary | Char | Index | Binary | Char | Index | Binary | Char | Index | Binary | Char |
  | :---: | :----: | :--: | :---: | :----: | :--: | :---: | :----: | :--: | :---: | :----: | :--- |
  |   0   | 000000 |  A   |  16   | 010000 |  Q   |  32   | 100000 |  g   |  48   | 110000 | w    |
  |   1   | 000001 |  B   |  17   | 010001 |  R   |  33   | 100001 |  h   |  49   | 110001 | x    |
  |   2   | 000010 |  C   |  18   | 010010 |  S   |  34   | 100010 |  i   |  50   | 110010 | y    |
  |   3   | 000011 |  D   |  19   | 010011 |  T   |  35   | 100011 |  j   |  51   | 110011 | z    |
  |   4   | 000100 |  E   |  20   | 010100 |  U   |  36   | 100100 |  k   |  52   | 110100 | 0    |
  |   5   | 000101 |  F   |  21   | 010101 |  V   |  37   | 100101 |  l   |  53   | 110101 | 1    |
  |   6   | 000110 |  G   |  22   | 010110 |  W   |  38   | 100110 |  m   |  54   | 110110 | 2    |
  |   7   | 000111 |  H   |  23   | 010111 |  X   |  39   | 100111 |  n   |  55   | 110111 | 3    |
  |   8   | 001000 |  I   |  24   | 011000 |  Y   |  40   | 101000 |  o   |  56   | 111000 | 4    |
  |   9   | 001001 |  J   |  25   | 011001 |  Z   |  41   | 101001 |  p   |  57   | 111001 | 5    |
  |  10   | 001010 |  K   |  26   | 011010 |  a   |  42   | 101010 |  q   |  58   | 111010 | 6    |
  |  11   | 001011 |  L   |  27   | 011011 |  b   |  43   | 101011 |  r   |  59   | 111011 | 7    |
  |  12   | 001100 |  M   |  28   | 011100 |  c   |  44   | 101100 |  s   |  60   | 111100 | 8    |
  |  13   | 001101 |  N   |  29   | 011101 |  d   |  45   | 101101 |  t   |  61   | 111101 | 9    |
  |  14   | 001110 |  O   |  30   | 011110 |  e   |  46   | 101110 |  u   |  62   | 111110 | +    |
  |  15   | 001111 |  P   |  31   | 011111 |  f   |  47   | 101111 |  v   |  63   | 111111 | /    |

- [Base64 | Wikipedia](https://en.wikipedia.org/wiki/Base64)
- [base-64 | github](https://github.com/mathiasbynens/base64)
- [`atob()` | MDN](https://developer.mozilla.org/en-US/docs/Web/API/atob)
- [`btoa()` | MDN](https://developer.mozilla.org/en-US/docs/Web/API/btoa)

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/base64@4.0.0-alpha.0/packages/base64#readme
