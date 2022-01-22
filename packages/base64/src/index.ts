const BASE64_CODES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const BASE64_CODE_PADDING = '='
const BASE64_CODE_LIST = BASE64_CODES.split('')
const BASE64_CODE_MAP = BASE64_CODE_LIST.reduce((acc, v, idx) => ({ ...acc, [v]: idx }), {
  [BASE64_CODE_PADDING]: 0,
})
const BASE64_VALIDATE_REGEX = new RegExp(`^[${BASE64_CODES}]+={0,2}$`)

export default { encode, decode, validate }

export function encode(data: Uint8Array): string {
  let result = ''
  const _end: number = Math.floor(data.length / 3) * 3
  for (let i = 0; i < _end; i += 3) {
    result += encodeUnit((data[i] << 16) | (data[i + 1] << 8) | data[i + 2])
  }

  switch (data.length - _end) {
    case 1: {
      const tail: string = encodeUnit(data[_end] << 16)
      result += tail.slice(0, 2) + BASE64_CODE_PADDING + BASE64_CODE_PADDING
      break
    }
    case 2: {
      const tail: string = encodeUnit((data[_end] << 16) | (data[_end + 1] << 8))
      result += tail.slice(0, 3) + BASE64_CODE_PADDING
    }
  }
  return result
}

export function decode(text: string): Uint8Array | never {
  if (text.length <= 0 || !validate(text)) {
    throw new TypeError('Invalid base64 string.')
  }

  let countOfPadding = 0
  for (let i = text.length - 1; i >= 0 && text[i] === BASE64_CODE_PADDING; --i) countOfPadding += 1
  const _size: number = (text.length >> 2) * 3 - countOfPadding
  const result: Uint8Array = new Uint8Array(_size)

  const _end: number = ((text.length - countOfPadding) >> 2) << 2
  let i = 0
  let j = 0
  for (; i < _end; i += 4, j += 3) {
    const v: number = decodeUint(text, i)
    result[j] = v >> 16
    result[j + 1] = (v >> 8) & 0xff
    result[j + 2] = v & 0xff
  }

  if (countOfPadding > 0) {
    const v: number = decodeUint(text, i)
    switch (countOfPadding) {
      case 1: {
        result[j] = v >> 16
        result[j + 1] = (v >> 8) & 0xff
        break
      }
      case 2: {
        result[j] = v >> 16
        break
      }
    }
  }
  return result
}

export function validate(text: string): boolean {
  // The length of a Base64 encoded string should be a multiple of 4.
  if (text.length & 3) return false
  return BASE64_VALIDATE_REGEX.test(text)
}

function encodeUnit(v: number): string {
  return (
    BASE64_CODE_LIST[(v >> 18) & 0x3f] +
    BASE64_CODE_LIST[(v >> 12) & 0x3f] +
    BASE64_CODE_LIST[(v >> 6) & 0x3f] +
    BASE64_CODE_LIST[v & 0x3f]
  )
}

function decodeUint(text: string, startIdx: number): number {
  const v: number =
    (BASE64_CODE_MAP[text.charAt(startIdx)] << 18) |
    (BASE64_CODE_MAP[text.charAt(startIdx | 1)] << 12) |
    (BASE64_CODE_MAP[text.charAt(startIdx | 2)] << 6) |
    BASE64_CODE_MAP[text.charAt(startIdx | 3)]
  return v
}
