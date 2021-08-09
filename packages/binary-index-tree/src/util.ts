/**
 * Calculate the minimum bit value of x
 *
 * @param x
 */
export function lowbit(x: number): number {
  return x & -x
}
