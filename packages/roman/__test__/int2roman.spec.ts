import { int2roman } from '../src'

describe('int2roman', function () {
  test('regular', function () {
    const results: string[] = []
    for (let n = 1; n < 4000; ++n) {
      results.push(`${n}: `.padStart(6) + int2roman(n))
    }
    expect(results).toMatchSnapshot('1..3999')
  })

  test('custom', function () {
    expect(int2roman(2137, 'ABCDEF')).toEqual('BBDFFF')
  })

  test('exception', function () {
    expect(() => int2roman(0)).toThrow(/Out of range/)
    expect(() => int2roman(4000)).toThrow(/Out of range/)
  })
})
