import { BIGINT_ONE, BIGINT_ZERO } from '@algorithm.ts/constant'

/**
 * Extended Euclidean algorithm for solving the smallest
 * integer solution (|x| + |y| smallest) of the equation `Ax + By = gcd(x,y)`.
 *
 * @param a
 * @param b
 * @returns
 * @see https://me.guanghechen.com/post/math/number-theory/%E6%A8%A1%E6%96%B9%E7%A8%8B/basic/
 */
export function euclidean(a: number, b: number): [number, number, number] {
  let x: number
  let y: number
  let d: number
  solve(a, b)
  return [x!, y!, d!]

  function solve(_a: number, _b: number): void {
    if (_b === 0) {
      x = 1
      y = 0
      d = _a
    } else {
      const A = _a % _b
      const B = _b
      solve(B, A)

      const X = y
      const Y = x

      x = X
      y = Y - Math.floor(_a / _b) * X
    }
  }
}

/**
 * Bigint version.
 *
 * @param a
 * @param b
 * @returns
 * @see https://me.guanghechen.com/post/math/number-theory/%E6%A8%A1%E6%96%B9%E7%A8%8B/basic/
 */
export function euclideanBigint(a: bigint, b: bigint): [bigint, bigint, bigint] {
  let x: bigint
  let y: bigint
  let d: bigint
  solve(a, b)
  return [x!, y!, d!]

  function solve(_a: bigint, _b: bigint): void {
    if (_b === BIGINT_ZERO) {
      x = BIGINT_ONE
      y = BIGINT_ZERO
      d = _a
    } else {
      const A = _a % _b
      const B = _b
      solve(B, A)

      const X = y
      const Y = x

      x = X
      y = Y - (_a / _b) * X
    }
  }
}
