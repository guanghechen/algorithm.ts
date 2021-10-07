import sievePrime from '../src'

describe('sieve-prime', function () {
  test('boundary', function () {
    expect(sievePrime(-1)).toEqual([])
    expect(sievePrime(0)).toEqual([])
    expect(sievePrime(1)).toEqual([])
    expect(sievePrime(2)).toEqual([])
    expect(sievePrime(5)).toEqual([2, 3])
    expect(sievePrime(6)).toEqual([2, 3, 5])
  })

  test('strict', function () {
    const primes: number[] = sievePrime(1000)

    const answers: number[] = []
    for (let i = 2; i < 1000; ++i) {
      let flag = true
      for (let j = 2; j * j <= i; ++j) {
        if (i > j && i % j === 0) {
          flag = false
          break
        }
      }
      if (flag) answers.push(i)
    }

    expect(primes).toEqual(answers)
  })
})
