import { TextEncoder } from 'node:util'
import { Base64, decode, encode, validate } from '../src'

describe('basic', () => {
  const kases = [
    {
      plaintext: 'Hello, world!',
      ciphertext: 'SGVsbG8sIHdvcmxkIQ==',
    },
    {
      plaintext: 'Hello, world!1',
      ciphertext: 'SGVsbG8sIHdvcmxkITE=',
    },
    {
      plaintext: 'Hello, world!11',
      ciphertext: 'SGVsbG8sIHdvcmxkITEx',
    },
    {
      plaintext: 'Hello, world!111',
      ciphertext: 'SGVsbG8sIHdvcmxkITExMQ==',
    },
  ]

  it('encode', function () {
    for (const { plaintext, ciphertext } of kases) {
      expect(encode(getBytes(plaintext))).toEqual(ciphertext)
    }
  })

  it('decode', function () {
    for (const { plaintext, ciphertext } of kases) {
      expect(decode(ciphertext)).toEqual(getBytes(plaintext))
    }
  })

  it('validate', function () {
    expect(validate('a')).toBe(false)
    expect(validate('aa')).toBe(false)
    expect(validate('aaa')).toBe(false)
    expect(validate('a===')).toBe(false)
    expect(() => decode('a')).toThrow(/Invalid base64 string/)
  })
})

describe('custom', () => {
  const base64 = new Base64({
    CODES: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#',
    CODE_PADDING: '*',
  })

  const kases = [
    {
      plaintext: 'Hello, world!',
      ciphertext: 'I6LiR6yi87TlScna8G**',
    },
    {
      plaintext: 'Hello, world!1',
      ciphertext: 'I6LiR6yi87TlScna8J4*',
    },
    {
      plaintext: 'Hello, world!11',
      ciphertext: 'I6LiR6yi87TlScna8J4n',
    },
    {
      plaintext: 'Hello, world!111',
      ciphertext: 'I6LiR6yi87TlScna8J4nCG**',
    },
  ]

  it('encode', function () {
    for (const { plaintext, ciphertext } of kases) {
      expect(base64.encode(getBytes(plaintext))).toEqual(ciphertext)
    }
  })

  it('decode', function () {
    for (const { plaintext, ciphertext } of kases) {
      expect(base64.decode(ciphertext)).toEqual(getBytes(plaintext))
    }
  })
})

describe('misc', () => {
  it('%4 == 0', () => testWithBytes(1000))
  it('%4 == 1', () => testWithBytes(1001))
  it('%4 == 2', () => testWithBytes(1002))
  it('%4 == 3', () => testWithBytes(1003))

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

const textEncoder = new TextEncoder()
function getBytes(text: string): Uint8Array {
  return textEncoder.encode(text)
}
