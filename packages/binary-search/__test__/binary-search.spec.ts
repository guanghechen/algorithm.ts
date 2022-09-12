import type { IBinarySearchCheck, IBinarySearchCheckBigint } from '../src'
import { binarySearch, binarySearchBigint } from '../src'

describe('binarySearch', function () {
  const hitFor =
    (x: number): IBinarySearchCheck =>
    mid =>
      mid === x ? 0 : mid < x ? -1 : 1

  test('basic', function () {
    const lft = -(2 ** 30)
    const rht = 2 ** 30

    for (let x = -100; x <= 100; ++x) {
      expect(binarySearch(lft, rht, hitFor(x))).toEqual(x)
    }
  })

  test('edge', function () {
    const lft = -(2 ** 30)
    const rht = 2 ** 30
    expect(binarySearch(lft, lft, hitFor(lft))).toEqual(null)
    expect(binarySearch(lft + 1, lft, hitFor(lft))).toEqual(null)
    expect(binarySearch(lft + 10, lft, hitFor(lft))).toEqual(null)

    expect(binarySearch(lft, rht, hitFor(lft))).toEqual(lft)
    expect(binarySearch(lft, rht, hitFor(lft - 1))).toEqual(null)
    expect(binarySearch(lft, rht, hitFor(lft + 1))).toEqual(lft + 1)
    expect(binarySearch(lft, rht, hitFor(rht))).toEqual(null)
    expect(binarySearch(lft, rht, hitFor(rht - 1))).toEqual(rht - 1)
    expect(binarySearch(lft, rht, hitFor(rht + 1))).toEqual(null)
  })
})

describe('binarySearchBigint', () => {
  const hitFor =
    (x: bigint): IBinarySearchCheckBigint =>
    mid =>
      mid === x ? 0 : mid < x ? -1 : 1

  test('basic', function () {
    const lft = -5000000000000n
    const rht = 500000000000000000000000000n

    for (let x = -100n; x <= 100n; ++x) {
      expect(binarySearchBigint(lft, rht, hitFor(x))).toEqual(x)
    }
  })

  test('edge', function () {
    const lft = -5000000000000n
    const rht = 500000000000000000000000000n

    expect(binarySearchBigint(lft, lft, hitFor(lft))).toEqual(null)
    expect(binarySearchBigint(lft + 1n, lft, hitFor(lft))).toEqual(null)
    expect(binarySearchBigint(lft + 10n, lft, hitFor(lft))).toEqual(null)

    expect(binarySearchBigint(lft, rht, hitFor(lft))).toEqual(lft)
    expect(binarySearchBigint(lft, rht, hitFor(lft - 1n))).toEqual(null)
    expect(binarySearchBigint(lft, rht, hitFor(lft + 1n))).toEqual(lft + 1n)
    expect(binarySearchBigint(lft, rht, hitFor(rht))).toEqual(null)
    expect(binarySearchBigint(lft, rht, hitFor(rht - 1n))).toEqual(rht - 1n)
    expect(binarySearchBigint(lft, rht, hitFor(rht + 1n))).toEqual(null)
  })
})
