/**
 * Find the greatest common divisor of x and y
 *
 * @param x
 * @param y
 * @returns
 */
export function gcd(x: number, y: number): number {
  return y === 0 ? x : gcd(y, x % y)
}

/**
 * Bigint version.
 *
 * @param x
 * @param y
 * @returns
 */
export function gcdBigint(x: bigint, y: bigint): bigint {
  return y === 0n ? x : gcdBigint(y, x % y)
}

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
    if (_b === 0n) {
      x = 1n
      y = 0n
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
