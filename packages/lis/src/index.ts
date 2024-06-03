import { lowerBound } from '@algorithm.ts/binary-search'
import type { ICompare } from '@algorithm.ts/internal'

/**
 * Find the length of the longest increasing subsequence,
 * optimized through monotonous stack.
 *
 * Time: $O(N \log N)$
 * Space: $O(N)$
 *
 * @param N
 * @param compare
 * @returns
 */
export function findLengthOfLIS(N: number, compare: ICompare<number>): number {
  if (N <= 0) return 0
  if (N === 1) return 1

  const stack: number[] = [0]
  for (let i = 1; i < N; ++i) {
    const idx: number = lowerBound(0, stack.length, x => compare(stack[x], i))

    // Update the monotonous stack.
    if (idx < stack.length) stack[idx] = i
    else stack.push(i)
  }
  return stack.length
}

/**
 * Find a longest increasing subsequence with a minimum lexicographic order,
 * optimized through monotonous stack.
 *
 * !!!Attention, the returned results is the indexes of the original nums, the
 * indexes indicated which elements constituted the minimum lexicographic order
 * of the longest increasing subsequence.
 *
 * Time: $O(N \log N)$
 * Space: $O(N)$
 *
 * @param N
 * @param compare
 * @returns
 */
export function findMinLexicographicalLIS(N: number, compare: ICompare<number>): number[] {
  if (N <= 0) return []
  if (N === 1) return [0]

  const ranks: number[][] = []
  const stack: number[] = []
  for (let i = 0; i < N; ++i) {
    const idx: number = lowerBound(0, stack.length, x => compare(stack[x], i))
    if (idx === stack.length) ranks[idx] = []
    ranks[idx].push(i)
    stack[idx] = i
  }

  let r = ranks.length - 1
  let x = ranks[r][0]
  stack[r] = x

  for (--r; r >= 0; --r) {
    for (const y of ranks[r]) {
      if (compare(y, x) < 0) {
        x = y
        stack[r] = x
        break
      }
    }
  }
  return stack
}
