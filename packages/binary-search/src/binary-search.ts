import { BIGINT_ONE } from '@algorithm.ts/internal'
import type { IBinarySearchCheck, IBinarySearchCheckBigint } from './types'

/**
 * Find the index of element which equals with the target element.
 * If there exists multiple elements equal to the target element, return any index of them.
 *
 * @param lft   Inclusive lower bound (signed 32-bit integer).
 * @param rht   Exclusive upper bound (signed 32-bit integer).
 * @param check
 * @returns
 */
export function binarySearch(lft: number, rht: number, check: IBinarySearchCheck): number | null {
  let i = lft
  for (let j = rht; i < j; ) {
    const mid = i + Math.floor((j - i) / 2)
    const delta = check(mid)
    if (delta === 0) return mid
    if (delta < 0) i = mid + 1
    else j = mid
  }
  return null
}

/**
 * Find the index of element which equals with the target element. (bigint version)
 * If there exists multiple elements equal to the target element, return any index of them.
 *
 * @param lft   (close) bigint
 * @param rht   (open) bigint
 * @param check
 * @returns
 */
export function binarySearchBigint(
  lft: bigint,
  rht: bigint,
  check: IBinarySearchCheckBigint,
): bigint | null {
  let i = lft
  for (let j = rht; i < j; ) {
    const mid = (i + j) >> BIGINT_ONE
    const delta = check(mid)
    if (delta === 0) return mid
    if (delta < 0) i = mid + BIGINT_ONE
    else j = mid
  }
  return null
}
