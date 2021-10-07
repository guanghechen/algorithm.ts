/**
 * Find the longest palindrome length centered at each position in the given
 * text string within the complexity of $O(N)$.
 *
 * Note: len is an array with a length of $2N-1$, which represents the radius
 * of the palindrome:
 *
 *  - len[2i] is equal to the radius of the longest palindrome centered at
 *    the position (i, i)
 *
 *  - len[2i+1] is equal to the radius of the longest palindrome centered at
 *    the position (i, i+1)
 *
 * ## Examples
 *
 *  'abbab'
 *
 *  ==>
 *
 *  len[3] = 2   // abba
 *  len[6] = 2   // bab
 *
 * @param text
 * @param len
 * @param N
 *
 * @see https://me.guanghechen.com/post/algorithm/string/manacher/
 */
export function manacher(text: string): number[] {
  const N = text.length
  const _size = N * 2 - 1
  const len: number[] = new Array(_size)

  len[0] = 1
  for (let i = 1, j = 0; i < _size; ++i) {
    const p: number = i >> 1
    const q: number = i - p
    const r: number = ((j + 1) >> 1) + len[j] - 1

    let L = r < q ? 0 : Math.min(r - q + 1, len[(j << 1) - i])
    while (p > L - 1 && q + L < N && text[p - L] === text[q + L]) L += 1
    len[i] = L

    // Update j
    if (q + L - 1 > r) j = i
  }
  return len
}

export default manacher
