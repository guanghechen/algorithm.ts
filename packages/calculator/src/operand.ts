import {
  BIGINT_ZERO,
  CODEPOINT_DIGIT_0,
  CODEPOINT_DIGIT_9,
  CODEPOINT_DOT,
} from '@algorithm.ts/internal'
import type { IOperand } from './types'

export const integerOperand: IOperand<number> = {
  ZERO: 0,
  add: (a: number, b: number): number => a + b,
  sub: (a: number, b: number): number => a - b,
  mul: (a: number, b: number): number => a * b,
  div: (a: number, b: number): number => Math.floor(a / b),
  parse: (expression: string, start: number, end: number): [nextStart: number, value: number] => {
    let i: number = start
    let value: number = 0
    for (; i < end; ++i) {
      const c: number = expression.charCodeAt(i)!
      if (c < CODEPOINT_DIGIT_0 || c > CODEPOINT_DIGIT_9) break
      value = value * 10 + c - CODEPOINT_DIGIT_0
    }
    return [i, value]
  },
}

export const decimalOperand: IOperand<number> = {
  ZERO: 0,
  add: (a: number, b: number): number => a + b,
  sub: (a: number, b: number): number => a - b,
  mul: (a: number, b: number): number => a * b,
  div: (a: number, b: number): number => a / b,
  parse: (expression: string, start: number, end: number): [nextStart: number, value: number] => {
    let i: number = start
    let hasDot: boolean = false
    for (; i < end; ++i) {
      const c: number = expression.charCodeAt(i)!
      if (c === CODEPOINT_DOT) {
        if (hasDot) return [-1, Number.NaN]
        hasDot = true
        continue
      }
      if (c < CODEPOINT_DIGIT_0 || c > CODEPOINT_DIGIT_9) break
    }
    return [i, Number(expression.slice(start, i))]
  },
}

export const bigintOperand: IOperand<bigint> = {
  ZERO: BIGINT_ZERO,
  add: (a: bigint, b: bigint): bigint => a + b,
  sub: (a: bigint, b: bigint): bigint => a - b,
  mul: (a: bigint, b: bigint): bigint => a * b,
  div: (a: bigint, b: bigint): bigint => a / b,
  parse: (expression: string, start: number, end: number): [nextStart: number, value: bigint] => {
    let i: number = start
    for (; i < end; ++i) {
      const c: number = expression.charCodeAt(i)!
      if (c < CODEPOINT_DIGIT_0 || c > CODEPOINT_DIGIT_9) break
    }
    return [i, BigInt(expression.slice(start, i))]
  },
}
