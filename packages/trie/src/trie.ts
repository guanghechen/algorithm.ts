import type { Trie, TrieNodeData } from './types'

/**
 * Options for create trie.
 */
export interface CreateTrieOptions<T extends unknown = number> {
  /**
   * The maximum number of children a parent node can have.
   */
  SIGMA_SIZE: number

  /**
   * The zero element of the additional value, we may pass in different types
   * of data, and the added value may perform a variety of different
   * mathematical transformations, so we need to specify a zero element.
   */
  ZERO: T

  /**
   * Map a character to an integer in the range [0, SIGMA_SIZE)
   */
  idx(c: string): number

  /**
   * Specify how to combine additional values.
   * When the same word is inserted in multiple times, there will be multiple
   * additional values, so we need to specify how to deal with them.
   *
   * @param prevValue
   * @param nextValue
   */
  mergeAdditionalValues(prevValue: T, nextValue: T): T
}

export function createTrie<T extends unknown = number>({
  SIGMA_SIZE,
  ZERO,
  idx,
  mergeAdditionalValues,
}: CreateTrieOptions<T>): Trie<T> {
  const ch: Uint32Array[] = []
  const values: T[] = [ZERO]
  let sz: number
  return { init, insert, match, find, findAll }

  function init(): void {
    if (ch[0] === undefined) ch[0] = new Uint32Array(SIGMA_SIZE)
    else ch[0].fill(0)
    sz = 1
  }

  function insert(str: string, v: T, start = 0, end = str.length): void {
    let u = 0
    for (let i = start; i < end; ++i) {
      const c: number = idx(str[i])
      if (ch[u][c] === 0) {
        if (ch[sz] === undefined) ch[sz] = new Uint32Array(SIGMA_SIZE)
        else ch[sz].fill(0)

        values[sz] = ZERO
        // eslint-disable-next-line no-plusplus
        ch[u][c] = sz++
      }
      u = ch[u][c]
    }
    // console.log('u:', u, sz)
    values[u] = mergeAdditionalValues(values[u], v)
  }

  function match(str: string, start = 0, end = str.length): T | null {
    let i = start
    let u = 0
    for (; i < end; ++i) {
      const c: number = idx(str[i])
      if (ch[u][c] === 0) break
      u = ch[u][c]
    }
    const val = values[u]
    return i < end || val === ZERO ? null : val
  }

  function find(
    str: string,
    start = 0,
    end = str.length,
  ): TrieNodeData<T> | null {
    for (let i = start, u = 0; i < end; ++i) {
      const c: number = idx(str[i])
      if (ch[u][c] === 0) break
      u = ch[u][c]
      const val = values[u]
      if (val !== ZERO) return { end: i + 1, val }
    }
    return null
  }

  function findAll(
    str: string,
    start = 0,
    end = str.length,
  ): Array<TrieNodeData<T>> {
    const results: Array<TrieNodeData<T>> = []
    for (let i = start, u = 0; i < end; ++i) {
      const c: number = idx(str[i])
      if (ch[u][c] === 0) break
      u = ch[u][c]
      const val = values[u]
      if (val !== ZERO) results.push({ end: i + 1, val })
    }
    return results
  }
}
