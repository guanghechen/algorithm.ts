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
