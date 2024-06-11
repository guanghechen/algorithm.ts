/**
 * Find the length of the longest common subsequence.
 *
 * @param N1
 * @param N2
 * @param equals
 * @returns
 * @see https://me.guanghechen.com/post/algorithm/lcs/
 */
export function lcs_size_dp(
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
): number {
  if (N1 <= 0 || N2 <= 0) return 0

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
  return dp[N2 - 1]
}
