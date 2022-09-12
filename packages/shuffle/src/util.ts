/**
 * Create a random integer in the range of [0, n)
 * @param n
 */
export function randomInt(n: number): number {
  const x = (Math.random() * n) >> 0
  /* istanbul ignore next */
  return x === n ? n - 1 : x
}
