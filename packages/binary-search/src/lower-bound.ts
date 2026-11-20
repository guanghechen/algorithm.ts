import { BIGINT_ONE } from '@algorithm.ts/internal'
import type { IBinarySearchCheck, IBinarySearchCheckBigint } from './types'

/**
 * Find the index of first element which greater or equals than the target element.
 *
 * @param lft   Inclusive lower bound (signed 32-bit integer).
 * @param rht   Exclusive upper bound (signed 32-bit integer).
 * @param check
 * @returns
 */
export function lowerBound(lft: number, rht: number, check: IBinarySearchCheck): number | -1 {
  let i = lft
  for (let j = rht; i < j; ) {
    const mid = i + Math.floor((j - i) / 2)
    if (check(mid) < 0) i = mid + 1
    else j = mid
  }
  return i
}

/**
 * Find the index of first element which greater or equal than the target element. (bigint version)
 *
 * @param lft   (close) bigint
 * @param rht   (open) bigint
 * @param check
 * @returns
 */
export function lowerBoundBigint(
  lft: bigint,
  rht: bigint,
  check: IBinarySearchCheckBigint,
): bigint {
  let i = lft
  for (let j = rht; i < j; ) {
    const mid = (i + j) >> BIGINT_ONE
    if (check(mid) < 0) i = mid + BIGINT_ONE
    else j = mid
  }
  return i
}
