import { upperBound, upperBoundBigInt } from '../src'

test('upper-bound', function () {
  for (let x = 0; x < 100; ++x) {
    const y = upperBound(0, 100, i => i - x)
    expect(y).toBe(x + 1)
  }

  expect(upperBound(0, 2 ** 31, () => -1)).toBe(2 ** 31)
})

test('lower-bound', function () {
  for (let x = 0; x < 100; ++x) {
    const y = upperBound(0, 100, i => (i >= x ? 1 : -1))
    expect(y).toBe(x)
  }
})

test('bigint', function () {
  expect(upperBoundBigInt(-5000000000000n, 500000000000000000000000000n, x => x - 1n)).toBe(2n)
})
