import { randomInt } from './util'

/**
 * An implementation of the Knuth-Shuffle algorithm, which can complete the shuffle in $O(N)$ time
 * complexity on the basis of only using a constant level of extra space.
 *
 * @param elements
 * @see https://me.guanghechen.com/post/algorithm/shuffle/#heading-knuth-shuffle
 */
export function knuthShuffle<T = unknown>(
  elements: T[],
  start = 0,
  end: number = elements.length,
): void {
  // biome-ignore lint/style/noParameterAssign: This algorithm updates its working state in place.
  if (start < 0) start = 0
  // biome-ignore lint/style/noParameterAssign: This algorithm updates its working state in place.
  if (end > elements.length) end = elements.length
  if (start + 1 >= end) return

  const N = end - start
  for (let n = N - 1, j = end - 1; n > 0; --n, --j) {
    const i: number = randomInt(n) + start
    const x: T = elements[i]
    // biome-ignore lint/style/noParameterAssign: This algorithm updates its working state in place.
    elements[i] = elements[j]
    // biome-ignore lint/style/noParameterAssign: This algorithm updates its working state in place.
    elements[j] = x
  }
}
