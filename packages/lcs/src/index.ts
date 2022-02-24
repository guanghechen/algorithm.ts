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

  // parent[x] represent the index of previous element which are consists the smallest
  // lexicographical longest common subsequence.
  const parent: number[] = new Array(N2).fill(-1)

  const dp: Uint32Array = new Uint32Array(N2)
  for (let i = 0, k: number; i < N1; ++i) {
    for (let j = N2 - 1; j > 0; --j) {
      if (isEqual(i, j)) {
        const candidate: number = dp[j - 1]

        // Find a longer common subsequence
        if (dp[j] < candidate + 1) {
          dp[j] = candidate + 1
          for (k = j - 1; k >= 0 && dp[k] === candidate; ) k -= 1
          parent[j] = k + 1
        }
      }
    }

    if (isEqual(i, 0)) dp[0] = 1

    for (let j = 1, x = dp[0]; j < N2; ++j) {
      if (dp[j] < x) dp[j] = x
      else x = dp[j]
    }
  }

  const maxLen = dp[N2 - 1]
  const paths: number[] = new Array(maxLen).fill(0)
  const head = dp.findIndex(x => x === maxLen)
  for (let p = head, k = maxLen - 1; p > -1; p = parent[p], --k) paths[k] = p

  const pairs: Array<[number, number]> = []
  for (let i = 0, k = 0; k < maxLen; ++k, ++i) {
    const j = paths[k]
    while (i < N1 && !isEqual(i, j)) i += 1
    pairs.push([i, j])
  }
  return pairs
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
