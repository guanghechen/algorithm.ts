import { gcd, gcdBigint } from '../src'

test('gcd', function () {
  expect(gcd(3, 6)).toEqual(3)
  expect(gcd(6, 3)).toEqual(3)
  expect(gcd(9, 6)).toEqual(3)
  expect(gcd(6, 9)).toEqual(3)

  for (let i = 1; i < 50; ++i) {
    expect(gcd(i, 0)).toBe(i)
    expect(gcd(0, i)).toBe(i)
    expect(gcd(i, i)).toBe(i)

    for (let j = 1; j < 50; ++j) {
      const d = gcd(i, j)
      expect(i % d).toBe(0)
      expect(j % d).toBe(0)
      expect(gcd(i / d, j / d)).toBe(1)
    }
  }
})

test('gcdBigint', function () {
  for (let i = 1n; i < 50n; ++i) {
    expect(gcdBigint(i, 0n)).toBe(i)
    expect(gcdBigint(0n, i)).toBe(i)
    for (let j = 1n; j < 50n; ++j) {
      const d = gcdBigint(i, j)
      expect(i % d).toBe(0n)
      expect(j % d).toBe(0n)
      expect(gcdBigint(i / d, j / d)).toBe(1n)
    }
  }
})
