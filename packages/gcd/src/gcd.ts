import { BIGINT_ZERO } from '@algorithm.ts/internal'

/**
 * Find the greatest common divisor of x and y
 *
 * @param x
 * @param y
 * @returns
 */
export function gcd(x: number, y: number): number {
  let i = x
  for (let j = y; j !== 0; ) {
    const t = i
    i = j
    j = t % i
  }
  return i
}

/**
 * Bigint version.
 *
 * @param x
 * @param y
 * @returns
 */
export function gcdBigint(x: bigint, y: bigint): bigint {
  let i = x
  for (let j = y; j !== BIGINT_ZERO; ) {
    const t = i
    i = j
    j = t % i
  }
  return i
}
