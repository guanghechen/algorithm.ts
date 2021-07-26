/**
 * Shuffle array.
 * @param nodes
 */
export function knuthShuffle<T extends unknown = unknown>(
  nodes: T[],
  _start = 0,
  _end: number = nodes.length,
): void {
  const start = Math.max(0, _start)
  const end = Math.min(nodes.length, _end)
  if (start + 1 >= end) return

  const N = end - start
  for (let n = N - 1, i: number, j = end - 1, x: T; n > 0; --n, --j) {
    i = ((Math.random() * n) >> 0) + start
    x = nodes[i]
    // eslint-disable-next-line no-param-reassign
    nodes[i] = nodes[j]
    // eslint-disable-next-line no-param-reassign
    nodes[j] = x
  }
}

export default knuthShuffle
