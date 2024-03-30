export type ITrieValue = number | string | boolean | null | bigint | symbol | object

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
export interface ITrie<E, V extends ITrieValue> {
  /**
   * Iterable.
   */
  [Symbol.iterator](): IterableIterator<V>

  /**
   * Determine if the trie has been destroyed.
   */
  readonly destroyed: boolean

  /**
   * Count the element in the collection.
   * @getter
   */
  readonly size: number

  /**
   * Destroy the trie and release the resources.
   */
  destroy(): void

  /**
   * Reset the collection and insert the initial elements.
   */
  init(): void

  /**
   * Insert a string (or an array) into the trie.
   *
   * @param elements  the path to be inserted.
   * @param value     the value of this element represented (or maps).
   */
  set(elements: Iterable<E>, value: V): this

  /**
   * Insert a string (or an array) into the trie.
   *
   * @param elements  the path to be inserted.
   * @param value     the value of this element represented (or maps).
   * @param start     the starting position of the element.
   * @param end       the ending position of the element.
   */
  set_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    value: V,
    start: number,
    end: number,
  ): this

  /**
   * Remove a string (or an array) from the trie.
   *
   * @param elements  the path to be removed.
   * @returns true if an element in the Trie existed and has been removed, or false if the element does not exist.
   */
  delete(elements: Iterable<E>): boolean

  /**
   * Remove a string (or an array) from the trie.
   *
   * @param elements  the path to be removed.
   * @param start     the starting position of the element.
   * @param end       the ending position of the element.
   * @returns true if an element in the Trie existed and has been removed, or false if the element does not exist.
   */
  delete_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    start: number,
    end: number,
  ): boolean

  /**
   * Find the value of the element which exactly matched the given elements.
   * If there is no such an element, then return undefined.
   *
   * @param elements  the path to be matched.
   */
  get(elements: Iterable<E>): V | undefined

  /**
   * Find the value of the element which exactly matched the `element.slice(start, end)`.
   * If there is no such an element, then return undefined.
   *
   * @param elements  the path to be matched.
   * @param start     the starting position of the element.
   * @param end       the ending position of the element.
   */
  get_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    start: number,
    end: number,
  ): V | undefined

  /**
   * Check if there is an element **exactly** matched the given elements.
   *
   * @param elements  the path to be matched.
   */
  has(elements: Iterable<E>): boolean

  /**
   * Check if there is an element **exactly** matched the `element.slice(start, end)`.
   *
   * @param elements  the path to be matched.
   * @param start     the starting position of the prefix.
   * @param end       the ending position of the prefix.
   */
  has_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    start: number,
    end: number,
  ): boolean

  /**
   * Check if there is an element which prefix matched the given elements
   *
   * @param prefix    the prefix to be matched.
   */
  hasPrefix(prefix: Iterable<E>): boolean

  /**
   * Check if there is an element which prefix matched the `prefix.slice(start, end)`.
   *
   * @param prefix    the prefix to be matched.
   * @param start     the starting position of the prefix.
   * @param end       the ending position of the prefix.
   */
  hasPrefix_advance(
    prefix: E extends string ? string : ReadonlyArray<E>,
    start: number,
    end: number,
  ): boolean

  /**
   * Find all elements in the trie which contained in the elements with the same prefix.
   *
   * @param elements  the path to be matched.
   */
  findAll(elements: Iterable<E>): Iterable<ITrieNodeData<V>>

  /**
   * Find all elements in the trie which exact match the element.slice(start, x),
   * where the x is an integer in the range [start, end).
   *
   * @param elements  the path to be matched.
   * @param start     the starting position of the element.
   * @param end       the ending position of the element.
   */
  findAll_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    start: number,
    end: number,
  ): Iterable<ITrieNodeData<V>>
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
export interface ITrieOptions<E, V = number> {
  /**
   * The maximum number of children a parent node can have.
   */
  SIGMA_SIZE: number
  /**
   * Map a character to an integer in the range [0, SIGMA_SIZE)
   */
  idx(c: E): number
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
