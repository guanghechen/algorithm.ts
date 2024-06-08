/**
 * !!!NOTE Don't try to edit the yield elements, it could cause unexpected results.
 *
 * Traverse all permutations of elements.
 *
 * @param elements
 * @param compare
 */
export function* permutatation(N: number): IterableIterator<ReadonlyArray<number>> {
  if (N <= 0 || !Number.isInteger(N)) return

  const nodes: number[] = new Array(N).fill(0).map((_x, i) => i + 1)
  for (let _end = nodes.length - 1; ; ) {
    yield nodes

    /**
     * Scan from right to left to find the first adjacent and reversed element
     * pair (i-1, i), swap the i-1th element with the last element, and then
     * reverse the order of the elements in [i, N]
     */
    let i = _end
    for (let j = i - 1; i > 0; i = j, --j) if (nodes[j] < nodes[i]) break

    // No such i existed.
    if (i <= 0) break

    let x = nodes[i - 1]
    let k = _end
    for (; k >= i; --k) if (x < nodes[k]) break
    nodes[i - 1] = nodes[k]
    nodes[k] = x
    const L = i + _end
    const mid = L >> 1
    for (let j = i; j <= mid; ++j) {
      x = nodes[j]
      nodes[j] = nodes[L - j]
      nodes[L - j] = x
    }
  }
}
