import { gcd } from '@algorithm.ts/gcd'
import { sievePrime, sieveTotient } from '../src'

describe('sievePrime', function () {
  it('boundary', function () {
    expect(sievePrime(-1)).toEqual([])
    expect(sievePrime(0)).toEqual([])
    expect(sievePrime(1)).toEqual([])
    expect(sievePrime(2)).toEqual([])
    expect(sievePrime(5)).toEqual([2, 3])
    expect(sievePrime(6)).toEqual([2, 3, 5])
  })

  it('basic', function () {
    const primes: number[] = sievePrime(1000)
    const answers: number[] = []
    for (let n = 2; n < 1000; ++n) {
      let flag = true
      for (let j = 2; j * j <= n; ++j) {
        if (n > j && n % j === 0) {
          flag = false
          break
        }
      }
      if (flag) answers.push(n)
    }

    expect(primes).toEqual(answers)
  })
})

describe('sieveTotient', function () {
  it('boundary', function () {
    expect(sieveTotient(-1)).toEqual([[], []])
    expect(sieveTotient(0)).toEqual([[], []])
    expect(sieveTotient(1)).toEqual([[0], []])
    expect(sieveTotient(2)).toEqual([[0, 1], []])
    expect(sieveTotient(5)).toEqual([
      [0, 1, 1, 2, 2],
      [2, 3],
    ])
    expect(sieveTotient(6)).toEqual([
      [0, 1, 1, 2, 2, 4],
      [2, 3, 5],
    ])
    expect(sieveTotient(10)).toEqual([
      [0, 1, 1, 2, 2, 4, 2, 6, 4, 6],
      [2, 3, 5, 7],
    ])
  })

  it('basic', function () {
    const [totients, primes] = sieveTotient(1000)

    const primeAnswers: number[] = []
    for (let n = 2; n < 1000; ++n) {
      let flag = true
      for (let j = 2; j * j <= n; ++j) {
        if (n > j && n % j === 0) {
          flag = false
          break
        }
      }
      if (flag) primeAnswers.push(n)
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
    expect(totients).toEqual(totientAnswers)
  })
})
