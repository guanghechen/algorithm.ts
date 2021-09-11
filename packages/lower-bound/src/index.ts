/**
 * Return the index of first elements which greater or equals than the target
 * element.
 *
 * @param left
 * @param right
 * @param cmp
 * @returns
 */
export function lowerBound(
  left: number,
  right: number,
  cmp: (index: number) => -1 | 0 | 1 | number,
): number | -1 {
  let i = left
  for (let j = right; i < j; ) {
    const k = (i + j) >> 1
    if (cmp(k) < 0) i = k + 1
    else j = k
  }
  return i
}

export default lowerBound
