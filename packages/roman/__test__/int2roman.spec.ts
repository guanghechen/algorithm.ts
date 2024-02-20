import { int2roman } from '../src'
import int2romanMap from './fixtures/int2romanMap.json'

describe('int2roman', function () {
  it('regular', function () {
    const results: Record<number, string> = {}
    for (let n = 1; n < 4000; ++n) {
      results[n] = int2roman(n)
    }
    expect(results).toEqual(int2romanMap)
  })

  it('custom', function () {
    expect(int2roman(2137, 'ABCDEF')).toEqual('BBDFFF')
  })

  it('exception', function () {
    expect(() => int2roman(0)).toThrow(/Out of range/)
    expect(() => int2roman(4000)).toThrow(/Out of range/)
  })
})
