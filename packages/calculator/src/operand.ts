import { BIGINT_ZERO } from '@algorithm.ts/_constant'
import type { IOperator } from '@algorithm.ts/types'

const DOT_CHAR_CODE = 46
const ZERO_CHAR_CODE = 48
const NINE_CHAR_CODE = 57

export interface IOperand<T>
  extends Pick<IOperator<T>, 'ZERO' | 'add' | 'subtract' | 'divide' | 'multiple'> {
  parse(expression: string, start: number, end: number): [nextStart: number, value: T]
}

export class IntegerOperand implements IOperand<number> {
  public readonly ZERO = 0

  public parse(expression: string, start: number, end: number): [nextStart: number, value: number] {
    let result = 0
    let i: number = start
    for (; i < end; ++i) {
      const c: number = expression.charCodeAt(i)!
      if (c < ZERO_CHAR_CODE || c > NINE_CHAR_CODE) break
      result = result * 10 + c - ZERO_CHAR_CODE
    }
    return [i, result]
  }

  public add(a: number, b: number): number {
    return a + b
  }

  public subtract(a: number, b: number): number {
    return a - b
  }

  public multiple(a: number, b: number): number {
    return a * b
  }

  public divide(a: number, b: number): number {
    return Math.floor(a / b)
  }
}

export class DecimalOperand extends IntegerOperand implements IOperand<number> {
  public override parse(
    expression: string,
    start: number,
    end: number,
  ): [nextStart: number, value: number] {
    let i = start
    let dotCnt = false
    for (; i < end; ++i) {
      const c: number = expression.charCodeAt(i)!
      if (c === DOT_CHAR_CODE) {
        if (dotCnt) return [-1, Number.NaN]
        dotCnt = true
        continue
      }

      if (c < ZERO_CHAR_CODE || c > NINE_CHAR_CODE) break
    }
    return [i, Number(expression.slice(start, i))]
  }

  public override divide(a: number, b: number): number {
    return a / b
  }
}

export class BigintOperand implements IOperand<bigint> {
  public readonly ZERO: bigint = BIGINT_ZERO

  public parse(expression: string, start: number, end: number): [nextStart: number, value: bigint] {
    let i = start
    for (; i < end; ++i) {
      const c: number = expression.charCodeAt(i)!
      if (c < ZERO_CHAR_CODE || c > NINE_CHAR_CODE) break
    }
    return [i, BigInt(expression.slice(start, i))]
  }

  public add(a: bigint, b: bigint): bigint {
    return a + b
  }

  public subtract(a: bigint, b: bigint): bigint {
    return a - b
  }

  public multiple(a: bigint, b: bigint): bigint {
    return a * b
  }

  public divide(a: bigint, b: bigint): bigint {
    return a / b
  }
}
