/**
 * Shuffle array.
 * @param nodes
 */
export function knuthShuffle<T extends unknown = unknown>(nodes: T[]): void {
  const N = nodes.length
  for (let i = N - 1, j: number, x: T; i > 0; --i) {
    j = Math.floor(Math.random() * (i + 1))
    x = nodes[i]
    // eslint-disable-next-line no-param-reassign
    nodes[i] = nodes[j]
    // eslint-disable-next-line no-param-reassign
    nodes[j] = x
  }
}
