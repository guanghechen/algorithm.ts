import { euclidean, euclideanBigint, gcd, gcdBigint } from '../src'

it('euclid', () => {
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

it.each([
  [3, -8],
  [-30, 4],
  [1, -30],
  [-3, -8],
  [0, -8],
  [-8, 0],
  [0, 0],
])('euclidean(%i, %i) satisfies the Bézout identity', (first, second) => {
  const solution = euclidean(first, second)
  const [firstCoefficient, secondCoefficient, divisor] = solution
  expect(first * firstCoefficient + second * secondCoefficient).toBe(divisor)
  expect(divisor).toBe(gcd(first, second))
  expect(solution.map(BigInt)).toEqual(euclideanBigint(BigInt(first), BigInt(second)))
})

it('euclidBigint', () => {
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
