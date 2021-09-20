import calculate from '../src'

describe('calculate', function () {
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
      input: '2 * 2 + 3',
      answer: 7,
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
    // eslint-disable-next-line jest/valid-title
    test(kase.input, function () {
      expect(calculate(kase.input)).toEqual(kase.answer)
    })
  }
})
