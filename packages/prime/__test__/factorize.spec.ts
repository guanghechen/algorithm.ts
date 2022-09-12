import type { IPrimeFactor } from '../src'
import { factorize, sievePrime } from '../src'

describe('factorize', function () {
  const primes: number[] = sievePrime(1000)
  const f = (n: number): IPrimeFactor[] => Array.from(factorize(n, primes))

  test('boundary', function () {
    expect(f(-1)).toEqual([])
    expect(f(0)).toEqual([])
    expect(f(1)).toEqual([])
    expect(f(2)).toEqual([{ factor: 2, exponential: 1 }])
    expect(f(3)).toEqual([{ factor: 3, exponential: 1 }])
    expect(f(4)).toEqual([{ factor: 2, exponential: 2 }])
    expect(f(5)).toEqual([{ factor: 5, exponential: 1 }])
    expect(f(6)).toEqual([
      { factor: 2, exponential: 1 },
      { factor: 3, exponential: 1 },
    ])
    expect(f(7)).toEqual([{ factor: 7, exponential: 1 }])
    expect(f(8)).toEqual([{ factor: 2, exponential: 3 }])
    expect(f(9)).toEqual([{ factor: 3, exponential: 2 }])
    expect(f(10)).toEqual([
      { factor: 2, exponential: 1 },
      { factor: 5, exponential: 1 },
    ])
  })

  test('basic', function () {
    let failedCount = 0
    for (let n = 2; n < 1000; ++n) {
      let x = 1
      for (const { factor, exponential } of factorize(n, primes)) {
        for (let t = 0; t < exponential; ++t) x *= factor
      }
      if (x !== n) failedCount += 1
    }
    expect(failedCount).toEqual(0)
  })
})
