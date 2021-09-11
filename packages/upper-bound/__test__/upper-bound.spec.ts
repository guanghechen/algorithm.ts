import { upperBound } from '../src'

test('upper-bound', function () {
  for (let x = 0; x < 100; ++x) {
    const y = upperBound(0, 100, i => i - x)
    expect(y).toBe(x + 1)
  }
})

test('lower-bound', function () {
  for (let x = 0; x < 100; ++x) {
    const y = upperBound(0, 100, i => (i >= x ? 1 : -1))
    expect(y).toBe(x)
  }
})
