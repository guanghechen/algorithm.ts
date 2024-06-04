import type { IEquals } from '@algorithm.ts/internal'

/**
 * Find a least lexicographical match for the longest common subsequence.
 *
 * The returned value is an tuple array (called `pairs`), where each element (pair=[i,j]) indicates that
 * the i-th element of the first sequence is paired with the j-th element of the second sequence.
 *
 * @param N1
 * @param N2
 * @param equals
 * @returns
 * @see https://me.guanghechen.com/post/algorithm/lcs/
 */
export function findMinLexicographicalLCS(
  N1: number,
  N2: number,
  equals: IEquals<number>,
): Array<[number, number]> {
  if (N1 <= 0 || N2 <= 0) return []

  const dp: number[][] = new Array(N1)
  for (let i = 0; i < N1; ++i) dp[i] = new Array(N2)

  {
    let first_i: number = 0
    let first_j: number = 0
    while (first_i < N1 && equals(first_i, 0) === false) ++first_i
    while (first_j < N2 && equals(0, first_j) === false) ++first_j

    dp[0].fill(0, 0, first_j)
    dp[0].fill(1, first_j, N2)

    for (let i = 0; i < first_i; ++i) dp[i][0] = 0
    for (let i = first_i; i < N1; ++i) dp[i][0] = 1
  }

  for (let i = 1; i < N1; ++i) {
    for (let j = 1; j < N2; ++j) {
      if (equals(i, j)) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        const x: number = dp[i][j - 1]
        const y: number = dp[i - 1][j]
        dp[i][j] = x < y ? y : x
      }
    }
  }

  const N: number = dp[N1 - 1][N2 - 1]
  const firsts: number[] = new Array(N + 1)
  for (let i = 0, j = N2 - 1, n = 1; n <= N; ++n) {
    while (dp[i][j] < n) ++i
    firsts[n] = i
  }

  const pairs: Array<[number, number]> = new Array(N)
  for (let j = N2 - 1, n = N; n > 0; --n) {
    let i: number = firsts[n]
    while (dp[i][j] < n) ++i
    while (j >= 0 && dp[i][j] === n) --j
    pairs[n - 1] = [i, j + 1]
  }
  return pairs
}

/**
 * Find the length of the longest common subsequence.
 *
 * @param N1
 * @param N2
 * @param equals
 * @returns
 * @see https://me.guanghechen.com/post/algorithm/lcs/
 */
export function findLengthOfLCS(N1: number, N2: number, equals: IEquals<number>): number {
  const dp = findLCSOfEveryRightPrefix(N1, N2, equals)
  return dp === null ? 0 : dp[N2 - 1]
}

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
  equals: IEquals<number>,
): number[] | null {
  if (N1 <= 0 || N2 <= 0) return null

  // dp[j] represent that the length of longest common subsequence of A[0..N1] and B[0..j]
  const dp: number[] = new Array(N2).fill(0)
  for (let i = 0; i < N1; ++i) {
    for (let j = N2 - 1; j > 0; --j) {
      if (equals(i, j)) {
        const candidate: number = dp[j - 1] + 1
        // Found a longer common subsequence.
        if (dp[j] < candidate) dp[j] = candidate
      }
    }

    if (equals(i, 0)) dp[0] = 1

    for (let j = 1, x = dp[0]; j < N2; ++j) {
      if (dp[j] < x) dp[j] = x
      else x = dp[j]
    }
  }
  return dp
}
