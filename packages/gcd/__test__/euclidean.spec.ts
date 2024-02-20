import { euclidean, euclideanBigint, gcd, gcdBigint } from '../src'

it('euclid', function () {
  for (let i = 1; i < 50; ++i) {
    for (let j = 1; j < 50; ++j) {
      const [x, y, d] = euclidean(i, j)
      expect(i % d).toBe(0)
      expect(j % d).toBe(0)
      expect(gcd(i / d, j / d)).toBe(1)
      expect(i * x + j * y).toBe(d)
    }
  }
})

it('euclidBigint', function () {
  for (let i = 1n; i < 50n; ++i) {
    for (let j = 1n; j < 50n; ++j) {
      const [x, y, d] = euclideanBigint(i, j)
      expect(i % d).toBe(0n)
      expect(j % d).toBe(0n)
      expect(gcdBigint(i / d, j / d)).toBe(1n)
      expect(i * x + j * y).toBe(d)
    }
  }
})
