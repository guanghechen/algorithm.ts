/**
 * Find a least lexicographical match for the longest common subsequence.
 *
 * The returned value is an number array (called `paired`), where the paired[j] indicates that the
 * j-th element of the second sequence is paired with the i-th element of the first sequence.
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
): number[] {
  if (N2 <= 0) return []
  if (N1 <= 0) return new Array(N2).fill(-1)

  const dp: number[][] = calcDpOfLCS(N1, N2, isEqual)
  const paired: number[] = new Array(N2).fill(-1)
  for (let len = dp[N1 - 1][N2 - 1], i = N1 - 1; len > 0; --len) {
    for (let j = 0; j < N2; ++j) {
      if (dp[i][j] === len) {
        while (i >= 0 && dp[i][j] === len) i -= 1
        paired[j] = i + 1
        break
      }
    }
  }
  return paired
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
  if (N1 <= 0 || N2 <= 0) return 0

  const dp: number[][] = calcDpOfLCS(N1, N2, isEqual)
  return dp[N1 - 1][N2 - 1]
}

/**
 * Find Longest Common Subsequence with Dynamic Programming.
 *
 * Let dp(i,j) denote the longest common subsequence of {a1,a2,...,ai} and {b1,b2,...,bj}, it is not
 * difficult to derive the transition equation:
 *
 *    dp(i,j) = max{dp(i-1,j), dp(i,j-1), dp(i-1,j-1)+f(i,j)}, where f(i,j) = 1 if ai=aj else 0
 *
 * @param N1
 * @param N2
 * @param isEqual
 * @returns
 * @see https://me.guanghechen.com/post/algorithm/lcs/
 */
export function calcDpOfLCS(
  N1: number,
  N2: number,
  isEqual: (x: number, y: number) => boolean,
): number[][] {
  if (N1 <= 0 || N2 <= 0) return []

  const dp: number[][] = new Array(N1)
  for (let i = 0; i < N1; ++i) dp[i] = new Array(N2)

  dp[0][0] = isEqual(0, 0) ? 1 : 0
  for (let i = 1; i < N1; ++i) dp[i][0] = dp[i - 1][0] | (isEqual(i, 0) ? 1 : 0)
  for (let j = 1; j < N2; ++j) dp[0][j] = dp[0][j - 1] | (isEqual(0, j) ? 1 : 0)

  for (let i = 1; i < N1; ++i) {
    for (let j = 1; j < N2; ++j) {
      dp[i][j] = isEqual(i, j) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i][j - 1], dp[i - 1][j])
    }
  }

  return dp
}
