import { BIGINT_ONE } from '@algorithm.ts/_constant'
import type { IBinarySearchCheck, IBinarySearchCheckBigint } from './types'

/**
 * Find the index of first element which greater or equals than the target element.
 *
 * @param lft   (close) non-negative integer in the range of [-2^31, 2^31)
 * @param rht   (open) non-negative integer in the range of [-2^31, 2^31)
 * @param check
 * @returns
 */
export function lowerBound(lft: number, rht: number, check: IBinarySearchCheck): number | -1 {
  let i = lft
  for (let j = rht; i < j; ) {
    const mid = (i + j) >> 1
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
