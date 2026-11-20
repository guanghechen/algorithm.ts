import type { IBinarySearchCheck } from '../src'
import {
  binarySearch,
  binarySearchBigint,
  lowerBound,
  lowerBoundBigint,
  upperBound,
  upperBoundBigint,
} from '../src'

const int32Min = -(2 ** 31)
const int32Max = 2 ** 31 - 1

function guardProbes(left: number, right: number, check: IBinarySearchCheck): IBinarySearchCheck {
  const maxProbes = Math.ceil(Math.log2(right - left + 1))
  let probes = 0
  return mid => {
    expect(Number.isInteger(mid)).toBe(true)
    expect(mid).toBeGreaterThanOrEqual(left)
    expect(mid).toBeLessThan(right)
    expect(++probes).toBeLessThanOrEqual(maxProbes)
    return check(mid)
  }
}

describe.each([
  { name: 'binarySearch', search: binarySearch, reference: binarySearchBigint },
  { name: 'lowerBound', search: lowerBound, reference: lowerBoundBigint },
  { name: 'upperBound', search: upperBound, reference: upperBoundBigint },
])('$name at integer boundaries', ({ search, reference }) => {
  it.each([
    [2 ** 30, 2 ** 30 + 1],
    [int32Min, int32Min + 1],
    [int32Max - 8, int32Max],
    [int32Min, int32Max],
  ])('stays within [%i, %i) and agrees with BigInt', (left, right) => {
    for (const target of new Set([left - 1, left, 0, right - 1, right])) {
      const check = guardProbes(left, right, mid => mid - target)
      const actual = search(left, right, check)
      const expected = reference(BigInt(left), BigInt(right), mid => Number(mid - BigInt(target)))
      expect(actual).toBe(expected === null ? null : Number(expected))
    }
  })
})

it('distinguishes the bounds of repeated matches near the upper limit', () => {
  const left = int32Max - 8
  const firstMatch = left + 2
  const pastMatches = left + 5
  const check = (): IBinarySearchCheck =>
    guardProbes(left, int32Max, mid => (mid < firstMatch ? -1 : mid < pastMatches ? 0 : 1))

  const match = binarySearch(left, int32Max, check())
  expect(match).toBeGreaterThanOrEqual(firstMatch)
  expect(match).toBeLessThan(pastMatches)
  expect(lowerBound(left, int32Max, check())).toBe(firstMatch)
  expect(upperBound(left, int32Max, check())).toBe(pastMatches)
})
