import { int2roman, roman2int } from '../src'

describe('roman2int', () => {
  it('regular', () => {
    for (let n = 1; n < 4000; ++n) {
      const roman: string = int2roman(n)
      const v: number = roman2int(roman)
      expect(v).toEqual(n)
    }
  })

  it('exception', () => {
    expect(() => roman2int('ABCD')).toThrow(/Invalid roman number/)
  })
})
