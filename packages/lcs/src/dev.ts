import type { IEquals } from '@algorithm.ts/internal'

/**
 * Find a least lexicographical match for the longest common subsequence.
 *
 * The returned value is an tuple array (called `pairs`), where each element (pair=[i,j]) indicates that
 * the i-th element of the first sequence is paired with the j-th element of the second sequence.
 *
 * Time: $O(N1 * N2)$
 * Space: $O(N1 + N2)$
 *
 * @param N1
 * @param N2
 * @param equals
 * @returns
 * @see https://me.guanghechen.com/post/algorithm/lcs/
 */
export function findMinLexicographicalLCS2(
  N1: number,
  N2: number,
  equals: IEquals<number>,
): Array<[number, number]> {
  if (N1 <= 0 || N2 <= 0) return []

  const dp: number[] = new Array(N2)
  const fx: number[] = new Array(N1)
  const fj: number[] = new Array(N1)
  const firsts: number[] = new Array(N1 + 1)

  fx[0] = 0
  fj[0] = -1
  firsts.fill(-1)
  for (let j = 0, x = 0; j < N2; ++j) {
    if (x === 1) dp[j] = 1
    else if (equals(0, j)) {
      dp[j] = x = 1
      fx[0] = 1
      fj[0] = j
      firsts[1] = 0
    } else {
      dp[j] = 0
    }
  }

  for (let i = 1; i < N1; ++i) {
    let prev_i_1_j_1 = dp[0]
    let vx = 0
    let vj = -1

    if (dp[0] === 1 || equals(i, 0)) {
      dp[0] = 1
      vx = 1
      vj = 0
    }

    for (let j = 1; j < N2; ++j) {
      const x: number = prev_i_1_j_1
      const y: number = dp[j - 1]
      const z: number = dp[j]
      const m: number = equals(i, j) ? x + 1 : y < z ? z : y

      prev_i_1_j_1 = z
      dp[j] = m

      if (vx < m) {
        vx = m
        vj = j
      }
    }

    fx[i] = vx
    fj[i] = vj
  }

  console.log(
    'dp:',
    fx.map((v, i) => {
      const x: string = String(i).padStart(2, '0')
      const y: string = String(v).padStart(2, '0')
      return `${x}:${y}`
    }),
  )

  console.log(
    'fx:',
    fx.map((v, i) => {
      const x: string = String(i).padStart(2, '0')
      const y: string = String(v).padStart(2, '0')
      const z: string = String(fj[i]).padStart(2, '0')
      return `${x}:${y}:${z}`
    }),
  )

  const N: number = dp[N2 - 1]
  for (let i = 0; i < N1; ++i) {
    const n: number = fx[i]
    if (firsts[n] === -1) firsts[n] = i
  }

  const pairs: Array<[number, number]> = new Array(N)
  for (let I = N1, J = N2, n = N; n > 0; --n) {
    const first: number = firsts[n] // i0 must be greater than -1
    for (let i = first, j: number; i < I; ++i) {
      j = fj[i]
      if (fx[i] === n && j < J) {
        pairs[n - 1] = [i, j]
        I = i
        J = j
        break
      }
    }
  }
  console.log('pairs:', pairs)
  return pairs
}
