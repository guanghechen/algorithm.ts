import { BIGINT_ONE } from '@algorithm.ts/internal'
import type { IBinarySearchCheck, IBinarySearchCheckBigint } from './types'

/**
 * Find the index of first element which greater than the target element.
 *
 * @param lft   Inclusive lower bound (signed 32-bit integer).
 * @param rht   Exclusive upper bound (signed 32-bit integer).
 * @param check
 * @returns
 */
export function upperBound(lft: number, rht: number, check: IBinarySearchCheck): number {
  let i = lft
  for (let j = rht; i < j; ) {
    const mid = i + Math.floor((j - i) / 2)
    if (check(mid) <= 0) i = mid + 1
    else j = mid
  }
  return i
}

/**
 * Find the index of first element which greater than the target element. (bigint version)
 *
 * @param lft   (close) bigint
 * @param rht   (open) bigint
 * @param check
 * @returns
 */
export function upperBoundBigint(
  lft: bigint,
  rht: bigint,
  check: IBinarySearchCheckBigint,
): bigint {
  let i = lft
  for (let j = rht; i < j; ) {
    const k = (i + j) >> BIGINT_ONE
    if (check(k) <= 0) i = k + BIGINT_ONE
    else j = k
  }
  return i
}
