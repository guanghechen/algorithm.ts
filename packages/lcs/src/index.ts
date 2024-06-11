export * from './dp/lcs'
export * from './dp/lcs_size'
export * from './myers/lcs'
export * from './myers/lcs_size'
export * from './myers_linear_space/lcs'
export * from './myers_linear_space/lcs_size'

export { lcs_dp as findMinLexicographicalLCS } from './dp/lcs'
export { lcs_size_dp as findLengthOfLCS } from './dp/lcs_size'

/**
 * Find Longest Common Subsequence with Dynamic Programming.
 *
 * Let dp(i,j) denote the longest common subsequence of {a1,a2,...,ai} and {b1,b2,...,bj}, it is not
 * difficult to derive the transition equation:
 *
 *    dp(i,j) = max{dp(i-1,j), dp(i,j-1), dp(i-1,j-1)+f(i,j)}, where f(i,j) = 1 if ai=aj else 0
 *
 * ### Optimization
 *
 * let dp(j) denote the longest common subsequence of {a1, a2, ...aN1} and {b1, b2, ...,bj}, then we
 * should update in reverse order, similar to the rolling array of the knapsack problem.
 *
 * The time complexity is still O(N1xN2), but the space complexity is optimized to O(N2) now.
 *
 * @param N1
 * @param N2
 * @param equals
 * @returns
 * @see https://me.guanghechen.com/post/algorithm/lcs/
 */
export function findLCSOfEveryRightPrefix(
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
): number[] | null {
  if (N1 <= 0 || N2 <= 0) return null

  // dp[j] represent that the length of longest common subsequence of A[0..N1] and B[0..j]
  const dp: number[] = new Array(N2)

  {
    let first_j: number = 0
    while (first_j < N2 && equals(0, first_j) === false) ++first_j
    dp.fill(0, 0, first_j)
    dp.fill(1, first_j, N2)
  }

  for (let i = 1; i < N1; ++i) {
    let prev_ij: number = dp[0]
    if (dp[0] === 0 && equals(i, 0)) dp[0] = 1

    for (let j = 1; j < N2; ++j) {
      const z: number = dp[j]
      if (equals(i, j)) dp[j] = prev_ij + 1
      else {
        const y: number = dp[j - 1]
        dp[j] = y < z ? z : y
      }
      prev_ij = z
    }
  }
  return dp
}
