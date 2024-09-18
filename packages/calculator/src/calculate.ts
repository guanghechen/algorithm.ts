import { TokenSymbol, idx, ll1Table, sddTable } from './constant'
import { bigintOperand, decimalOperand, integerOperand } from './operand'
import type { ICalculator, IOperand } from './types'

export class Calculator<T> implements ICalculator<T> {
  protected readonly _ZERO: T
  protected readonly _operand: IOperand<T>
  protected readonly _resolveExpression?: (expression: string) => string

  constructor(operand: IOperand<T>, resolveExpression?: (expression: string) => string) {
    this._ZERO = operand.ZERO
    this._operand = operand
    this._resolveExpression = resolveExpression
  }

  public calculate(rawExpression: string): T {
    const { _ZERO, _operand, _resolveExpression } = this
    const expression =
      _resolveExpression == null ? rawExpression : _resolveExpression(rawExpression)

    let cur = 0
    const result: T = execute(idx('A'), _ZERO, _ZERO)
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
          const [nextCur, value] = _operand.parse(expression, cur, expression.length)

          // No valid number found.
          if (cur >= nextCur) {
            throw new SyntaxError('Invalid number')
          }

          cur = nextCur
          return value
        }

        cur += 1
        return syn
      }

      // Syntax error.
      /* istanbul ignore next */
      if (id > 0) {
        throw new SyntaxError('Not a valid arithmetic expression.')
      }

      const ssdId = ll1Table[-id][id0]
      if (ssdId < 0) {
        throw new SyntaxError('Not a valid arithmetic expression.')
      }

      const tokens: ReadonlyArray<number> = sddTable[ssdId]
      const syn0: T = tokens.length > 0 ? execute(tokens[0], _ZERO, _ZERO) : _ZERO

      /* istanbul ignore next */
      switch (ssdId) {
        // 0: A --> BD
        case 0:
          return execute(tokens[1], _ZERO, syn0)

        // 1: A --> +BD
        case 1: {
          const val1: T = execute(tokens[1], _ZERO, _ZERO)
          return execute(tokens[2], _ZERO, val1)
        }

        // 2: A --> -BD
        case 2: {
          const val1: T = execute(tokens[1], _ZERO, _ZERO)
          return execute(tokens[2], _ZERO, _operand.sub(_ZERO, val1))
        }

        // 3: B --> CE
        case 3:
          return execute(tokens[1], _ZERO, syn0)

        // 4: C --> digit
        case 4:
          return syn0

        // 5: C --> (A)
        case 5: {
          const result: T = execute(tokens[1], _ZERO, _ZERO)
          execute(tokens[2], _ZERO, _ZERO)
          return result
        }

        // 6: D --> +BD
        case 6: {
          const val1: T = execute(tokens[1], _ZERO, _ZERO)
          return execute(tokens[2], _ZERO, _operand.add(inh, val1))
        }

        // 7: D --> -BD
        case 7: {
          const val1: T = execute(tokens[1], _ZERO, _ZERO)
          return execute(tokens[2], _ZERO, _operand.sub(inh, val1))
        }

        // 8: D --> \varepsilon
        case 8:
          return inh

        // 9: E --> *CE
        case 9: {
          const val1: T = execute(tokens[1], _ZERO, _ZERO)
          return execute(tokens[2], _ZERO, _operand.mul(inh, val1))
        }

        // 10: E --> /CE
        case 10: {
          const val1: T = execute(tokens[1], _ZERO, _ZERO)
          return execute(tokens[2], _ZERO, _operand.div(inh, val1))
        }

        // 11: E --> \varepsilon
        case 11:
          return inh

        // Here is not reachable.
        default:
          /* istanbul ignore next */
          throw new Error('Shit codes!')
      }
    }
  }
}

// Integer calculate.
export const calculator: ICalculator<number> = new Calculator<number>(integerOperand, expression =>
  expression.replace(/[\s]+/g, ''),
)

// Decimal calculate.
export const decimalCalculator: ICalculator<number> = new Calculator<number>(
  decimalOperand,
  expression => expression.replace(/[\s]+/g, '').replace(/(^|[^\d.])\./g, '$10.'),
)

// Bigint calculate.
export const bigintCalculator: ICalculator<bigint> = new Calculator<bigint>(
  bigintOperand,
  expression => expression.replace(/[\s]+/g, ''),
)
