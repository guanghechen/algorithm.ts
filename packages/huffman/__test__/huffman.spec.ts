import { compress, decode, decompress, encode, fromEncodingTable } from '../src'

describe('basic', function () {
  it('empty', () => textWrapper(''))
  it('Hello, world!', () => textWrapper('Hello, world!'))
  it('Hello, world!1', () => textWrapper('Hello, world!1'))
  it('Hello, world!11', () => textWrapper('Hello, world!11'))
  it('Hello, world!111', () => textWrapper('Hello, world!111'))

  it('中文', () => textWrapper('中文'))

  function textWrapper(text: string): void {
    const encodeResult = encode(text)
    expect(encodeResult).toMatchSnapshot()

    const { encodedData, encodingTable, tree } = encodeResult

    const text2: string = decode(encodedData, tree)
    expect(text2).toEqual(text)

    const tree2 = fromEncodingTable(encodingTable)
    expect(tree).toEqual(tree2)

    expect(decode(encodedData, tree2)).toEqual(text)

    const compressedData = compress(encodedData)
    expect(compressedData).toMatchSnapshot()

    expect(decompress(compressedData)).toEqual(encodedData)
  }
})

it('unexpected', function () {
  const { encodedData, encodingTable } = encode('Hello, world!')
  const { H, ...encodingTable2 } = encodingTable
  const tree2 = fromEncodingTable(encodingTable2)

  expect(() => decode(encodedData, tree2)).toThrow(/Bad encoded data or huffman tree/)
})
