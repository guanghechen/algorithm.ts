import type { IBinarySearchCheck, IBinarySearchCheckBigint } from '../src'
import { upperBound, upperBoundBigint } from '../src'

describe('upperBound', function () {
  const hitFor =
    (x: number): IBinarySearchCheck =>
    mid =>
      mid === x ? 0 : mid < x ? -1 : 1

  test('basic', function () {
    const lft = -(2 ** 30)
    const rht = 2 ** 30

    for (let x = -100; x <= 100; ++x) {
      expect(upperBound(lft, rht, hitFor(x))).toEqual(x + 1)
    }
  })

  test('edge', function () {
    const lft = -(2 ** 30)
    const rht = 2 ** 30

    expect(upperBound(lft, lft, hitFor(lft))).toEqual(lft)
    expect(upperBound(lft + 1, lft, hitFor(lft))).toEqual(lft + 1)
    expect(upperBound(lft + 10, lft, hitFor(lft))).toEqual(lft + 10)

    expect(upperBound(lft, rht, hitFor(lft))).toEqual(lft + 1)
    expect(upperBound(lft, rht, hitFor(lft - 1))).toEqual(lft)
    expect(upperBound(lft, rht, hitFor(lft + 1))).toEqual(lft + 2)
    expect(upperBound(lft, rht, hitFor(rht))).toEqual(rht)
    expect(upperBound(lft, rht, hitFor(rht - 1))).toEqual(rht)
    expect(upperBound(lft, rht, hitFor(rht - 2))).toEqual(rht - 1)
    expect(upperBound(lft, rht, hitFor(rht + 1))).toEqual(rht)
  })
})

describe('upperBoundBigint', () => {
  const hitFor =
    (x: bigint): IBinarySearchCheckBigint =>
    mid =>
      mid === x ? 0 : mid < x ? -1 : 1

  test('basic', function () {
    const lft = -5000000000000n
    const rht = 500000000000000000000000000n

    for (let x = -100n; x <= 100n; ++x) {
      expect(upperBoundBigint(lft, rht, hitFor(x))).toEqual(x + 1n)
    }
  })

  test('edge', function () {
    const lft = -5000000000000n
    const rht = 500000000000000000000000000n

    expect(upperBoundBigint(lft, lft, hitFor(lft))).toEqual(lft)
    expect(upperBoundBigint(lft + 1n, lft, hitFor(lft))).toEqual(lft + 1n)
    expect(upperBoundBigint(lft + 10n, lft, hitFor(lft))).toEqual(lft + 10n)

    expect(upperBoundBigint(lft, rht, hitFor(lft))).toEqual(lft + 1n)
    expect(upperBoundBigint(lft, rht, hitFor(lft - 1n))).toEqual(lft)
    expect(upperBoundBigint(lft, rht, hitFor(lft + 1n))).toEqual(lft + 2n)
    expect(upperBoundBigint(lft, rht, hitFor(rht))).toEqual(rht)
    expect(upperBoundBigint(lft, rht, hitFor(rht - 1n))).toEqual(rht)
    expect(upperBoundBigint(lft, rht, hitFor(rht - 2n))).toEqual(rht - 1n)
    expect(upperBoundBigint(lft, rht, hitFor(rht + 1n))).toEqual(rht)
  })
})
