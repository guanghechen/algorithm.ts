const DOT_CHAR_CODE = 46
const ZERO_CHAR_CODE = 48
const NINE_CHAR_CODE = 57

export interface IOperations<T extends number | bigint = number> {
  ZERO: T
  parse(s: string, start: number): [nextStart: number, value: T]
  add(a: T, b: T): T
  subtract(a: T, b: T): T
  multiply(a: T, b: T): T
  divide(a: T, b: T): T
}

export const integerOperations: IOperations = {
  ZERO: 0,
  parse: (s, start) => {
    let result = 0
    let i: number = start
    for (; i < s.length; ++i) {
      const c: number = s.charCodeAt(i)!
      if (c < ZERO_CHAR_CODE || c > NINE_CHAR_CODE) break
      result = result * 10 + c - ZERO_CHAR_CODE
    }
    return [i, result]
  },
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => Math.floor(a / b),
}

export const decimalOperations: IOperations = {
  ZERO: 0,
  parse: (s, start) => {
    let i = start
    let dotCnt = false
    for (; i < s.length; ++i) {
      const c: number = s.charCodeAt(i)!
      if (c === DOT_CHAR_CODE) {
        if (dotCnt) return [-1, Number.NaN]
        dotCnt = true
        continue
      }

      if (c < ZERO_CHAR_CODE || c > NINE_CHAR_CODE) break
    }
    return [i, Number(s.slice(start, i))]
  },
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
}

export const bigintOperations: IOperations<bigint> = {
  ZERO: 0n,
  parse: (s, start) => {
    let i = start
    for (; i < s.length; ++i) {
      const c: number = s.charCodeAt(i)!
      if (c < ZERO_CHAR_CODE || c > NINE_CHAR_CODE) break
    }
    return [i, BigInt(s.slice(start, i))]
  },
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
}
