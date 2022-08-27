export interface IBinarySearchCheck {
  (mid: number): -1 | 0 | 1 | number
}

export interface IBinarySearchCheckBigint {
  (mid: bigint): -1 | 0 | 1 | number
}

/**
 * Find the index of first element which greater than the target element.
 *
 * @param lft   (close) non-negative integer in the range of [-2^31, 2^31)
 * @param rht   (open) non-negative integer in the range of [-2^31, 2^31)
 * @param check
 * @returns
 */
export function upperBound(lft: number, rht: number, check: IBinarySearchCheck): number {
  let i = lft
  for (let j = rht; i < j; ) {
    const mid = (i + j) >> 1
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
    const k = (i + j) >> 1n
    if (check(k) <= 0) i = k + 1n
    else j = k
  }
  return i
}

export default upperBound
