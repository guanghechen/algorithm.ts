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
export function lcs_dp(
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
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
