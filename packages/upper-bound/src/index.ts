/**
 * Return the index of first elements which greater than the target element.
 *
 * @param left    non-negative integer in the range of [0, 2^31]
 * @param right   non-negative integer in the range of [1, 2^31]
 * @param cmp
 * @returns
 */
export function upperBound(
  left: number,
  right: number,
  cmp: (mid: number) => -1 | 0 | 1 | number | bigint,
): number {
  let i = left
  for (let j = right; i < j; ) {
    const k = (i + j) >>> 1
    if (cmp(k) <= 0) i = k + 1
    else j = k
  }
  return i
}

/**
 * Return the index of first elements which greater than the target element.
 *
 * @param left    bigint
 * @param right   bigint
 * @param cmp
 * @returns
 */
export function upperBoundBigInt(
  left: bigint,
  right: bigint,
  cmp: (mid: bigint) => -1 | 0 | 1 | number | bigint,
): bigint {
  let i = left
  for (let j = right; i < j; ) {
    const k = (i + j) >> 1n
    if (cmp(k) <= 0) i = k + 1n
    else j = k
  }
  return i
}

export default upperBound
