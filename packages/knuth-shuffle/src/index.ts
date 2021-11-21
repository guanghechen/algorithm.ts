/**
 * Shuffle array.
 * @param nodes
 */
export function knuthShuffle<T = unknown>(
  nodes: T[],
  _start = 0,
  _end: number = nodes.length,
): void {
  const start = Math.max(0, _start)
  const end = Math.min(nodes.length, _end)
  if (start + 1 >= end) return

  const N = end - start
  for (let n = N - 1, i: number, j = end - 1, x: T; n > 0; --n, --j) {
    i = randomInt(n) + start
    x = nodes[i]
    // eslint-disable-next-line no-param-reassign
    nodes[i] = nodes[j]
    // eslint-disable-next-line no-param-reassign
    nodes[j] = x
  }
}

/**
 * Create a random integer in the range of [0, n)
 * @param n
 */
export function randomInt(n: number): number {
  const x = (Math.random() * n) >> 0
  return x === n ? n - 1 : x
}

export default knuthShuffle
