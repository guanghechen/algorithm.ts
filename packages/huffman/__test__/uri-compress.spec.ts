import base64 from '@algorithm.ts/base64'
import { TextDecoder, TextEncoder } from 'util'
import type { IHuffmanEncodingTable } from '../src'
import huffman from '../src'

describe('uri-compress', function () {
  const data = { name: 'alice', age: 33, gender: 'female' }

  test('compress', function () {
    expect(compress(JSON.stringify(data))).toEqual(
      'WyIzIiwyMCwiLCIsMTYsIn0iLDM0LCJpIiwzNSwiZyIsMTgsIm4iLDE5LCJsIiwyMSwiciIsNDQsImMiLDkwLCJkIiw5MSwiOiIsMjMsIlwiIiw2LCJlIiwxNCwiYSIsMzAsInsiLDEyNCwiZiIsMTI1LCJtIiw2M10_-BvI)(p7lG1oLi06IEWNvMnvd(l0C',
    )
  })

  test('decompress', function () {
    expect(
      decompress(
        'WyIzIiwyMCwiLCIsMTYsIn0iLDM0LCJpIiwzNSwiZyIsMTgsIm4iLDE5LCJsIiwyMSwiciIsNDQsImMiLDkwLCJkIiw5MSwiOiIsMjMsIlwiIiw2LCJlIiwxNCwiYSIsMzAsInsiLDEyNCwiZiIsMTI1LCJtIiw2M10_-BvI)(p7lG1oLi06IEWNvMnvd(l0C',
      ),
    ).toEqual('{"name":"alice","age":33,"gender":"female"}')
  })
})

function compress(text: string): string {
  const { encodedData, encodingTable } = huffman.encode(text)
  const cipherBuffer = huffman.compress(encodedData)
  const cipherText = base64.encode(cipherBuffer)

  // const textEncoder = new TextEncoder('utf-8')
  const textEncoder = new TextEncoder()
  const encodingTableText = base64.encode(
    textEncoder.encode(JSON.stringify(compressEncodingTable(encodingTable))),
  )
  const compressedText = (encodingTableText + '-' + cipherText)
    .replace(/\//g, '(')
    .replace(/\+/g, ')')
    .replace(/=/g, '_')
  return compressedText
}

function decompress(compressedText: string): string {
  const [encodingTableText, cipherText] = compressedText
    .replace(/\(/g, '/')
    .replace(/\)/g, '+')
    .replace(/_/g, '=')
    .split('-')

  // const textDecoder = new TextDecoder('utf-8')
  const textDecoder = new TextDecoder()
  const encodingTable = decompressEncodingTable(
    JSON.parse(textDecoder.decode(base64.decode(encodingTableText))),
  )
  const tree = huffman.fromEncodingTable(encodingTable)

  const cipherData = huffman.decompress(base64.decode(cipherText))
  const plaintext = huffman.decode(cipherData, tree)
  return plaintext
}

function compressEncodingTable(table: IHuffmanEncodingTable): Array<string | number> {
  const entries = Object.entries(table)
    .map(([value, path]) => {
      let p = 1
      for (const x of path) p = (p << 1) | x
      return [value, p] as [string, number]
    })
    .flat()
  return entries
}

function decompressEncodingTable(entries: Array<string | number>): IHuffmanEncodingTable {
  const table = {}
  for (let i = 0; i < entries.length; i += 2) {
    const value = entries[i] as string
    const p = entries[i + 1] as number
    const path = []
    for (let x = p; x > 1; x >>= 1) path.push(x & 1)
    table[value] = path.reverse()
  }
  return table
}
