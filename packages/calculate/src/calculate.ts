import { TokenSymbol, idx, ll1Table, sddTable } from './constant'
import type { Operations } from './operations'
import {
  bigintOperations,
  decimalOperations,
  integerOperations,
} from './operations'

export type Calculate<T extends number | bigint> = (expression: string) => T

export function createCalculate<T extends number | bigint>(
  operations: Operations<T>,
  resolveExpression?: (s: string) => string,
): Calculate<T> {
  const { ZERO, parse, add, subtract, multiply, divide } = operations
  return function (rawExpression: string): T {
    const expression =
      resolveExpression == null
        ? rawExpression
        : resolveExpression(rawExpression)

    let cur = 0
    const result: T = execute(idx('A'), ZERO, ZERO)
    if (cur === expression.length) return result
    throw new SyntaxError('Not a valid arithmetic expression.')

    function execute(id: number, syn: T, inh: T): T {
      if (cur === expression.length) {
        // Only D and E could be parsed as \varepsilon
        if (id === TokenSymbol.D || id === TokenSymbol.E) return inh
        throw new SyntaxError('Not a valid arithmetic expression.')
      }

      const id0 = idx(expression[cur])

      // Unrecognized symbol.
      if (id0 === undefined) {
        throw new SyntaxError(`Unrecognized symbol: ${expression[cur]}`)
      }

      // Matched an operator.
      if (id === id0) {
        // Matched digits.
        if (id0 === TokenSymbol.DIGIT) {
          const [nextCur, value] = parse(expression, cur)

          // No valid number found.
          if (cur >= nextCur) {
            throw new SyntaxError(`Invalid number`)
          }

          cur = nextCur
          return value
        }

        cur += 1
        return syn
      }

      // Syntax error.
      if (id > 0) {
        throw new SyntaxError('Not a valid arithmetic expression.')
      }

      const ssdId = ll1Table[-id][id0]
      if (ssdId < 0) {
        throw new SyntaxError('Not a valid arithmetic expression.')
      }

      const tokens: ReadonlyArray<number> = sddTable[ssdId]
      const syn0: T = tokens.length > 0 ? execute(tokens[0], ZERO, ZERO) : ZERO

      switch (ssdId) {
        // 0: A --> BD
        case 0:
          return execute(tokens[1], ZERO, syn0)

        // 1: A --> +BD
        case 1: {
          const val1: T = execute(tokens[1], ZERO, ZERO)
          return execute(tokens[2], ZERO, val1)
        }

        // 2: A --> -BD
        case 2: {
          const val1: T = execute(tokens[1], ZERO, ZERO)
          return execute(tokens[2], ZERO, subtract(ZERO, val1))
        }

        // 3: B --> CE
        case 3:
          return execute(tokens[1], ZERO, syn0)

        // 4: C --> digit
        case 4:
          return syn0

        // 5: C --> (A)
        case 5: {
          const result: T = execute(tokens[1], ZERO, ZERO)
          execute(tokens[2], ZERO, ZERO)
          return result
        }

        // 6: D --> +BD
        case 6: {
          const val1: T = execute(tokens[1], ZERO, ZERO)
          return execute(tokens[2], ZERO, add(inh, val1))
        }

        // 7: D --> -BD
        case 7: {
          const val1: T = execute(tokens[1], ZERO, ZERO)
          return execute(tokens[2], ZERO, subtract(inh, val1))
        }

        // 8: D --> \varepsilon
        case 8:
          return inh

        // 9: E --> *CE
        case 9: {
          const val1: T = execute(tokens[1], ZERO, ZERO)
          return execute(tokens[2], ZERO, multiply(inh, val1))
        }

        // 10: E --> /CE
        case 10: {
          const val1: T = execute(tokens[1], ZERO, ZERO)
          return execute(tokens[2], ZERO, divide(inh, val1))
        }

        // 11: E --> \varepsilon
        case 11:
          return inh

        // Here is not reachable.
        default:
          throw new Error('Shit codes!')
      }
    }
  }
}

// Integer calculate.
export const calculate: Calculate<number> = createCalculate<number>(
  integerOperations,
  s => s.replace(/[\s]+/g, ''),
)

// Decimal calculate.
export const decimalCalculate: Calculate<number> = createCalculate<number>(
  decimalOperations,
  s => s.replace(/[\s]+/g, '').replace(/(^|[^\d.])\./g, '$10.'),
)

// Bigint calculate.
export const bigintCalculate: Calculate<bigint> = createCalculate<bigint>(
  bigintOperations,
  s => s.replace(/[\s]+/g, ''),
)
