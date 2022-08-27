import type { IBinarySearchCheck, IBinarySearchCheckBigint } from '../src'
import { lowerBound, lowerBoundBigint } from '../src'

describe('lowerBound', function () {
  const hitFor =
    (x: number): IBinarySearchCheck =>
    mid =>
      mid === x ? 0 : mid < x ? -1 : 1

  test('basic', () => {
    const lft = -(2 ** 30)
    const rht = 2 ** 30

    for (let x = -100; x <= 100; ++x) {
      expect(lowerBound(lft, rht, hitFor(x))).toEqual(x)
    }
  })

  test('edge', () => {
    const lft = -(2 ** 30)
    const rht = 2 ** 30

    expect(lowerBound(lft, lft, hitFor(lft))).toEqual(lft)
    expect(lowerBound(lft + 1, lft, hitFor(lft))).toEqual(lft + 1)
    expect(lowerBound(lft + 10, lft, hitFor(lft))).toEqual(lft + 10)

    expect(lowerBound(lft, rht, hitFor(lft))).toEqual(lft)
    expect(lowerBound(lft, rht, hitFor(lft - 1))).toEqual(lft)
    expect(lowerBound(lft, rht, hitFor(lft + 1))).toEqual(lft + 1)
    expect(lowerBound(lft, rht, hitFor(rht))).toEqual(rht)
    expect(lowerBound(lft, rht, hitFor(rht - 1))).toEqual(rht - 1)
    expect(lowerBound(lft, rht, hitFor(rht + 1))).toEqual(rht)
  })
})

describe('lowerBoundBigint', () => {
  const hitFor =
    (x: bigint): IBinarySearchCheckBigint =>
    mid =>
      mid === x ? 0 : mid < x ? -1 : 1

  test('basic', () => {
    const lft = -5000000000000n
    const rht = 500000000000000000000000000n

    for (let x = -100n; x <= 100n; ++x) {
      expect(lowerBoundBigint(lft, rht, hitFor(x))).toEqual(x)
    }
  })

  test('edge', () => {
    const lft = -5000000000000n
    const rht = 500000000000000000000000000n

    expect(lowerBoundBigint(lft, lft, hitFor(lft))).toEqual(lft)
    expect(lowerBoundBigint(lft + 1n, lft, hitFor(lft))).toEqual(lft + 1n)
    expect(lowerBoundBigint(lft + 10n, lft, hitFor(lft))).toEqual(lft + 10n)

    expect(lowerBoundBigint(lft, rht, hitFor(lft))).toEqual(lft)
    expect(lowerBoundBigint(lft, rht, hitFor(lft - 1n))).toEqual(lft)
    expect(lowerBoundBigint(lft, rht, hitFor(lft + 1n))).toEqual(lft + 1n)
    expect(lowerBoundBigint(lft, rht, hitFor(rht))).toEqual(rht)
    expect(lowerBoundBigint(lft, rht, hitFor(rht - 1n))).toEqual(rht - 1n)
    expect(lowerBoundBigint(lft, rht, hitFor(rht + 1n))).toEqual(rht)
  })
})
