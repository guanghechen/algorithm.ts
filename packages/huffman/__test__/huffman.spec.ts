import { compress, decode, decompress, encode, fromEncodingTable } from '../src'

describe('basic', () => {
  it('empty', () => textWrapper(''))
  it('Hello, world!', () => textWrapper('Hello, world!'))
  it('Hello, world!1', () => textWrapper('Hello, world!1'))
  it('Hello, world!11', () => textWrapper('Hello, world!11'))
  it('Hello, world!111', () => textWrapper('Hello, world!111'))

  it('中文', () => textWrapper('中文'))

  it.each([
    { symbol: 'a', count: 1 },
    { symbol: 'a', count: 4 },
    { symbol: '😀', count: 9 },
  ])('single-symbol round trip: $symbol (count: $count)', ({ symbol, count }) => {
    const text = symbol.repeat(count)
    const { encodedData, encodingTable, tree } = encode(text)
    expect(encodingTable).toEqual({ [symbol]: [0] })
    expect(encodedData).toEqual(Array(count).fill(0))
    expect(decode(encodedData, tree)).toBe(text)

    const rebuiltTree = fromEncodingTable(encodingTable)
    expect(rebuiltTree).toEqual(tree)
    expect(decode(decompress(compress(encodedData)), rebuiltTree)).toBe(text)
  })

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

it('unexpected', () => {
  const { encodedData, encodingTable } = encode('Hello, world!')
  const { H, ...encodingTable2 } = encodingTable
  const tree2 = fromEncodingTable(encodingTable2)

  expect(() => decode(encodedData, tree2)).toThrow(/Bad encoded data or huffman tree/)
})
