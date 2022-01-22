import { TextEncoder } from 'util'
import { decode, encode, validate } from '../src'

describe('basic', function () {
  test('%4 == 0', () => testWithBytes(1000))
  test('%4 == 1', () => testWithBytes(1001))
  test('%4 == 2', () => testWithBytes(1002))
  test('%4 == 3', () => testWithBytes(1003))

  function testWithBytes(size: number): void {
    const data = new Uint8Array(size)
    for (let i = 0; i < size; ++i) data[i] = Math.round(Math.random() * 256) * 0xff

    const encodedData = encode(data)
    expect(typeof encodedData).toBe('string')
    expect(validate(encodedData)).toBe(true)

    const decodedData = decode(encodedData)
    expect(decodedData).toBeInstanceOf(Uint8Array)
    expect(data.length).toEqual(decodedData.length)

    expect(data).toEqual(decodedData)
  }
})

describe('unexpected', function () {
  test('bad base64 string', function () {
    expect(validate('a')).toBe(false)
    expect(validate('aa')).toBe(false)
    expect(validate('aaa')).toBe(false)
    expect(validate('a===')).toBe(false)

    expect(() => decode('a')).toThrow(/Invalid base64 string/)
  })
})

test('snapshot', function () {
  const textEncoder = new TextEncoder()
  const getBytes = (text: string): Uint8Array => textEncoder.encode(text)

  expect(encode(getBytes('Hello, world!'))).toMatchSnapshot()
  expect(encode(getBytes('Hello, world!1'))).toMatchSnapshot()
  expect(encode(getBytes('Hello, world!11'))).toMatchSnapshot()
  expect(encode(getBytes('Hello, world!111'))).toMatchSnapshot()
})
