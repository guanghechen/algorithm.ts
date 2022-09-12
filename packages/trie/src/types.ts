import type { ICollection } from '@algorithm.ts/types'

/**
 * > In computer science, a trie, also called digital tree or prefix tree, is a
 * > type of search tree, a tree data structure used for locating specific keys
 * > from within a set. These keys are most often strings, with links between
 * > nodes defined not by the entire key, but by individual characters. In order
 * > to access a key (to recover its value, change it, or remove it), the trie
 * > is traversed depth-first, following the links between nodes, which
 * > represent each character in the key.
 *
 * @see https://en.wikipedia.org/wiki/Trie
 */
export interface ITrie<E extends unknown[] | string, V> extends ICollection<V> {
  /**
   * Insert a string (or an array) into the trie.
   *
   * @param element the data to be inserted.
   * @param value   the value of this element represented (or maps).
   * @param start   the starting position of the element. (default: 0)
   * @param end     the ending position of the element. (default: element.length)
   */
  set(element: Readonly<E>, value: V, start?: number, end?: number): this
  /**
   * Remove a string (or an array) from the trie.
   *
   * @param element
   * @param start   the starting position of the element. (default: 0)
   * @param end     the ending position of the element. (default: element.length)
   * @returns true if an element in the Trie existed and has been removed, or false if the element does not exist.
   */
  delete(element: Readonly<E>, start?: number, end?: number): boolean
  /**
   * Find the value of the element which exactly matched the `element.slice(start, end)`.
   * If there is no such an element, then return undefined.
   *
   * @param element
   * @param start   the starting position of the element. (default: 0)
   * @param end     the ending position of the element. (default: element.length)
   */
  get(element: Readonly<E>, start?: number, end?: number): V | undefined
  /**
   * Check if there is an element exactly matched the `element.slice(start, end)`.
   *
   * @param element  the prefix to be matched.
   * @param start   the starting position of the prefix. (default: 0)
   * @param end     the ending position of the prefix. (default: prefix.length)
   */
  has(element: Readonly<E>, start?: number, end?: number): boolean
  /**
   * Check if there is an element which prefix matched the `prefix.slice(start, end)`.
   *
   * @param prefix
   * @param start
   * @param end
   */
  hasPrefix(prefix: Readonly<E>, start?: number, end?: number): boolean
  /**
   * Find the element with smallest length and exact match the `element.slice(start, x)`, where the
   * x is an integer in the range [start, end).
   *
   * For example, if the trie contains the elements {"abc": 101, "abcd":102, "abcde": 103},
   * when you execute `trie.find("abcde"), the result `{ end: 2, val: 101 }` will returned,
   * because `abc` is the smallest element which exactly matched the `element.slice(start, 2)`.
   *
   * @param element
   * @param start   the starting position of the element. (default: 0)
   * @param end     the ending position of the element. (default: element.length)
   */
  find(element: Readonly<E>, start?: number, end?: number): ITrieNodeData<V> | undefined
  /**
   * Find all elements in the trie which exact match the element.slice(start, x),
   * where the x is an integer in the range [start, end).
   *
   * @param element
   * @param start   the starting position of the element. (default: 0)
   * @param end     the ending position of the element. (default: element.length)
   */
  findAll(element: Readonly<E>, start?: number, end?: number): Iterable<ITrieNodeData<V>>
}

/**
 * Result (s) data of the Trie.find, Tried.findAll
 */
export interface ITrieNodeData<T> {
  /**
   * The ending position of the original string.
   */
  end: number
  /**
   * The additional value of a word in the trie.
   */
  val: T
}

/**
 * Options for create trie.
 */
export interface ITrieOptions<E extends unknown[] | string, V = number> {
  /**
   * The maximum number of children a parent node can have.
   */
  SIGMA_SIZE: number
  /**
   * Map a character to an integer in the range [0, SIGMA_SIZE)
   */
  idx(c: E[number]): number
  /**
   * Specify how to merge additional values of a same trie node.
   * When the same word is inserted in multiple times, there will be multiple node values,
   * so we need to specify how to deal with them.
   *
   * @param prevValue
   * @param nextValue
   */
  mergeNodeValue(prevValue: V, nextValue: V): V
}
