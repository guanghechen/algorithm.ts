import { Buffer } from 'node:buffer'
import { TextEncoder } from 'node:util'
import { Base64, decode, encode, validate } from '../src'

describe('basic', () => {
  const kases = [
    { plaintext: '', ciphertext: '' },
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

  it('encode', () => {
    for (const { plaintext, ciphertext } of kases) {
      expect(encode(getBytes(plaintext))).toEqual(ciphertext)
    }
  })

  it('decode', () => {
    for (const { plaintext, ciphertext } of kases) {
      expect(decode(ciphertext)).toEqual(getBytes(plaintext))
    }
  })

  it('validate', () => {
    expect(validate('')).toBe(true)
    expect(validate('a')).toBe(false)
    expect(validate('aa')).toBe(false)
    expect(validate('aaa')).toBe(false)
    expect(validate('a===')).toBe(false)
    expect(validate('====')).toBe(false)
    expect(() => decode('a')).toThrow(/Invalid base64 string/)
    expect(() => decode('====')).toThrow(TypeError)
  })
})

describe('custom', () => {
  const base64 = new Base64({
    CODES: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#',
    CODE_PADDING: '*',
  })

  const kases = [
    { plaintext: '', ciphertext: '' },
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

  it('encode', () => {
    for (const { plaintext, ciphertext } of kases) {
      expect(base64.encode(getBytes(plaintext))).toEqual(ciphertext)
    }
  })

  it('decode', () => {
    for (const { plaintext, ciphertext } of kases) {
      expect(base64.decode(ciphertext)).toEqual(getBytes(plaintext))
    }
  })

  it('validate', () => {
    expect(base64.validate('')).toBe(true)
    expect(base64.validate('****')).toBe(false)
    expect(() => base64.decode('****')).toThrow(TypeError)
  })
})

describe('literal alphabets and padding', () => {
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const urlSafe = new Base64({ CODES: `${alphanumeric}-_` })

  it.each([
    { bytes: [248], text: '-A==' },
    { bytes: [255, 255], text: '__8=' },
    { bytes: [251, 255, 255], text: '-___' },
  ])('round-trips the URL-safe encoding $text', ({ bytes, text }) => {
    const data = Uint8Array.from(bytes)
    expect(urlSafe.encode(data)).toBe(text)
    expect(urlSafe.validate(text)).toBe(true)
    expect(urlSafe.decode(text)).toEqual(data)
  })

  it.each(['@@@@', '+A==', '/w==', '-A', 'A=A=', '===='])('rejects %s in URL-safe mode', text => {
    expect(urlSafe.validate(text)).toBe(false)
    expect(() => urlSafe.decode(text)).toThrow(TypeError)
  })

  it('agrees with Node on every single byte in both standard and URL-safe mode', () => {
    for (let byte = 0; byte <= 255; ++byte) {
      const data = Uint8Array.of(byte)
      const reference = Buffer.from(data)
      const standardText = reference.toString('base64')
      const urlSafeText = reference.toString('base64url').padEnd(4, '=')
      expect(encode(data)).toBe(standardText)
      expect(decode(standardText)).toEqual(data)
      expect(urlSafe.encode(data)).toBe(urlSafeText)
      expect(urlSafe.decode(urlSafeText)).toEqual(data)
    }
  })

  it('rejects misplaced or excessive literal padding across two quartets', () => {
    const codec = new Base64({ CODE_PADDING: '.' })
    const validSizes = new Map([
      ['AAAAAAAA', 6],
      ['AAAAAAA.', 5],
      ['AAAAAA..', 4],
    ])
    for (let mask = 0; mask < 256; ++mask) {
      const symbols = Array.from({ length: 8 }, (_, index) => (mask & (1 << index) ? '.' : 'A'))
      const text = symbols.join('')
      const size = validSizes.get(text)
      expect(codec.validate(text), text).toBe(size !== undefined)
      if (size === undefined) expect(() => codec.decode(text), text).toThrow(TypeError)
      else expect(codec.decode(text)).toEqual(new Uint8Array(size))
    }
  })

  it('treats character-class metacharacters as alphabet symbols', () => {
    const symbols = '^][\\-'
    const codes = symbols + `${alphanumeric}+/`.slice(symbols.length)
    const codec = new Base64({ CODES: codes })
    for (let index = 0; index < codes.length; ++index) {
      const data = Uint8Array.of(index << 2)
      const text = `${codes[index]}${codes[0]}==`
      expect(codec.encode(data)).toBe(text)
      expect(codec.validate(text)).toBe(true)
      expect(codec.decode(text)).toEqual(data)
    }
    expect(codec.validate('AAAA')).toBe(false)
  })

  it.each(Array.from('.+?()[]{}|\\^$*-'))('treats %s as literal padding', padding => {
    const codec = new Base64({ CODES: `${alphanumeric}@#`, CODE_PADDING: padding })
    const data = Uint8Array.of(102)
    const text = `Zg${padding}${padding}`
    expect(codec.encode(data)).toBe(text)
    expect(codec.validate(text)).toBe(true)
    expect(codec.decode(text)).toEqual(data)
    expect(codec.validate(`Z${padding}g${padding}`)).toBe(false)
    expect(codec.validate('Zg!!')).toBe(false)
    expect(() => codec.decode('Zg!!')).toThrow(TypeError)
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
