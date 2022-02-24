/**
 * Find a least lexicographical match for the longest common subsequence.
 *
 * The returned value is an tuple array (called `pairs`), where each element (pair=[i,j]) indicates that
 * the i-th element of the first sequence is paired with the j-th element of the second sequence.
 *
 * @param N1
 * @param N2
 * @param isEqual
 * @returns
 * @see https://me.guanghechen.com/post/algorithm/lcs/
 */
export function findMinLexicographicalLCS(
  N1: number,
  N2: number,
  isEqual: (x: number, y: number) => boolean,
): Array<[number, number]> {
  if (N1 <= 0 || N2 <= 0) return []

  const dp: Uint32Array[] = new Array(N1)
  for (let i = 0; i < N1; ++i) dp[i] = new Uint32Array(N2)

  dp[0][0] = isEqual(0, 0) ? 1 : 0
  for (let i = 1; i < N1; ++i) dp[i][0] = dp[i - 1][0] | (isEqual(i, 0) ? 1 : 0)
  for (let j = 1; j < N2; ++j) dp[0][j] = dp[0][j - 1] | (isEqual(0, j) ? 1 : 0)

  for (let i = 1; i < N1; ++i) {
    for (let j = 1; j < N2; ++j) {
      dp[i][j] = isEqual(i, j) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i][j - 1], dp[i - 1][j])
    }
  }

  const pairs: Array<[number, number]> = []
  for (let len = dp[N1 - 1][N2 - 1], i = N1 - 1; len > 0; --len) {
    for (let j = 0; j < N2; ++j) {
      if (dp[i][j] === len) {
        while (i >= 0 && dp[i][j] === len) i -= 1
        pairs.push([i + 1, j])
        break
      }
    }
  }
  return pairs.reverse()
}

/**
 * Find the length of the longest common subsequence.
 *
 * @param N1
 * @param N2
 * @param isEqual
 * @returns
 * @see https://me.guanghechen.com/post/algorithm/lcs/
 */
export function findLengthOfLCS(
  N1: number,
  N2: number,
  isEqual: (x: number, y: number) => boolean,
): number {
  const dp: Uint32Array | null = findLCSOfEveryRightPrefix(N1, N2, isEqual)
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
 * @param isEqual
 * @returns
 * @see https://me.guanghechen.com/post/algorithm/lcs/
 */
export function findLCSOfEveryRightPrefix(
  N1: number,
  N2: number,
  isEqual: (x: number, y: number) => boolean,
): Uint32Array | null {
  if (N1 <= 0 || N2 <= 0) return null

  // dp[j] represent that the length of longest common subsequence of A[0..N1] and B[0..j]
  const dp: Uint32Array = new Uint32Array(N2)
  for (let i = 0; i < N1; ++i) {
    for (let j = N2 - 1; j > 0; --j) {
      if (isEqual(i, j)) {
        const candidate: number = dp[j - 1] + 1
        // Find a longer common subsequence
        if (dp[j] < candidate) dp[j] = candidate
      }
    }

    if (isEqual(i, 0)) dp[0] = 1

    for (let j = 1, x = dp[0]; j < N2; ++j) {
      if (dp[j] < x) dp[j] = x
      else x = dp[j]
    }
  }
  return dp
}
