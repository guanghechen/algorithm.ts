import { gcd } from '@algorithm.ts/gcd'
import sieveTotient from '../src'

describe('sieve-totient', function () {
  test('boundary', function () {
    expect(sieveTotient(-1)).toEqual([new Uint32Array(), []])
    expect(sieveTotient(0)).toEqual([new Uint32Array(), []])
    expect(sieveTotient(1)).toEqual([new Uint32Array([0]), []])
    expect(sieveTotient(2)).toEqual([new Uint32Array([0, 1]), []])
    expect(sieveTotient(5)).toEqual([new Uint32Array([0, 1, 1, 2, 2]), [2, 3]])
    expect(sieveTotient(6)).toEqual([
      new Uint32Array([0, 1, 1, 2, 2, 4]),
      [2, 3, 5],
    ])
    expect(sieveTotient(10)).toEqual([
      new Uint32Array([0, 1, 1, 2, 2, 4, 2, 6, 4, 6]),
      [2, 3, 5, 7],
    ])
  })

  test('strict', function () {
    const [totients, primes] = sieveTotient(1000)

    const primeAnswers: number[] = []
    for (let i = 2; i < 1000; ++i) {
      let flag = true
      for (let j = 2; j * j <= i; ++j) {
        if (i > j && i % j === 0) {
          flag = false
          break
        }
      }
      if (flag) primeAnswers.push(i)
    }
    expect(primes).toEqual(primeAnswers)

    const totientAnswers: number[] = [0, 1]
    for (let i = 2; i < 1000; ++i) {
      let cnt = 1
      for (let j = 2; j < i; ++j) {
        if (gcd(i, j) === 1) cnt += 1
      }
      totientAnswers.push(cnt)
    }
    expect(totients).toEqual(new Uint32Array(totientAnswers))
  })
})
