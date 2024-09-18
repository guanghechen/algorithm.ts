import { Calculator, bigintCalculator, calculator, decimalCalculator } from '../src'
import { integerOperand } from '../src/operand'

describe('basic', function () {
  it('custom', function () {
    const calculator = new Calculator(integerOperand)
    expect(calculator.calculate('1+2')).toEqual(3)
    expect(() => calculator.calculate('1+2.2')).toThrow(/Unrecognized symbol/)
  })
})

describe('calculate', function () {
  const data = [
    {
      input: '-0',
      answer: 0,
    },
    {
      input: '+1.3',
      answer: 1.3,
    },
    {
      input: '0.2',
      answer: 0.2,
    },
    {
      input: '-2+1',
      answer: -1,
    },
    {
      input: '2 + 2 * 3',
      answer: 8,
    },
    {
      input: '(2 + 2) * 3',
      answer: 12,
    },
    {
      input: '2 + 3 / 2',
      answer: 3.5,
    },
    {
      input: '2 * 2 + 3',
      answer: 7,
    },
    {
      input: '.1 + 0.2 + 2.8 * 3',
      answer: 8.7,
    },
    {
      input: '0.1.2 + 0.2',
      answer: Number.NaN,
    },
    {
      input: '(1+(4+5+2)-3)+(6+8)',
      answer: 23,
    },
    {
      input: '-2*3 + 2*5*3/6',
      answer: -1,
    },
    {
      input: '+2-3',
      answer: -1,
    },
    {
      input: '-2*/2',
      answer: Number.NaN,
    },
    {
      input: '1+(4+5+2))',
      answer: Number.NaN,
    },
    {
      input: '1+(4+5+2',
      answer: Number.NaN,
    },
    {
      input: '-2++1',
      answer: Number.NaN,
    },
  ]

  for (const kase of data) {
    it(kase.input, function () {
      if (Number.isNaN(kase.answer)) {
        expect(() => decimalCalculator.calculate(kase.input)).toThrow()
      } else {
        expect(decimalCalculator.calculate(kase.input)).toEqual(kase.answer)
      }
    })
  }

  it('exceptional', function () {
    expect(() => decimalCalculator.calculate('$0.2')).toThrow(/Not a valid arithmetic expression/)
    expect(() => decimalCalculator.calculate('1.1$0.2')).toThrow(
      /Not a valid arithmetic expression/,
    )
  })
})

describe('integer calculate', function () {
  const data = [
    {
      input: '-2+1',
      answer: -1,
    },
    {
      input: '2 + 2 * 3',
      answer: 8,
    },
    {
      input: '(2 + 2) * 3',
      answer: 12,
    },
    {
      input: '2 + 3 / 2',
      answer: 3,
    },
    {
      input: '2 * 2 + 3',
      answer: 7,
    },
    {
      input: '.1 + 0.2 + 2.8 * 3',
      answer: Number.NaN,
    },
    {
      input: '(1+(4+5+2)-3)+(6+8)',
      answer: 23,
    },
    {
      input: '-2*3 + 2*5*3/6',
      answer: -1,
    },
    {
      input: '+2-3',
      answer: -1,
    },
    {
      input: '-2*/2',
      answer: Number.NaN,
    },
    {
      input: '1+(4+5+2))',
      answer: Number.NaN,
    },
    {
      input: '1+(4+5+2',
      answer: Number.NaN,
    },
    {
      input: '-2++1',
      answer: Number.NaN,
    },
  ]

  for (const kase of data) {
    it(kase.input, function () {
      if (Number.isNaN(kase.answer)) {
        expect(() => calculator.calculate(kase.input)).toThrow()
      } else {
        expect(calculator.calculate(kase.input)).toEqual(kase.answer)
      }
    })
  }
})

describe('bigint calculate', function () {
  const data = [
    {
      input: '-2+1',
      answer: -1n,
    },
    {
      input: '2 + 2 * 3',
      answer: 8n,
    },
    {
      input: '(2 + 2) * 3',
      answer: 12n,
    },
    {
      input: '2 + 3 / 2',
      answer: 3n,
    },
    {
      input: '2 * 2 + 3',
      answer: 7n,
    },
    {
      input: '.1 + 0.2 + 2.8 * 3',
      answer: Number.NaN,
    },
    {
      input: '(1+(4+5+2)-3)+(6+8)',
      answer: 23n,
    },
    {
      input: '-2*3 + 2*5*3/6',
      answer: -1n,
    },
    {
      input: '+2-3',
      answer: -1n,
    },
    {
      input: '-2*/2',
      answer: Number.NaN,
    },
    {
      input: '1+(4+5+2))',
      answer: Number.NaN,
    },
    {
      input: '1+(4+5+2',
      answer: Number.NaN,
    },
    {
      input: '-2++1',
      answer: Number.NaN,
    },
    {
      input: '22222222222222222222222222222 * 3333333333333333333323232',
      answer: 74074074074074074073849599999259259259259259259261504n,
    },
  ]

  for (const kase of data) {
    it(kase.input, function () {
      if (Number.isNaN(kase.answer)) {
        expect(() => bigintCalculator.calculate(kase.input)).toThrow()
      } else {
        expect(bigintCalculator.calculate(kase.input)).toEqual(kase.answer)
      }
    })
  }
})
