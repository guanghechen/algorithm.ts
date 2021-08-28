/**
 * Result (s) data of the Trie.find, Tried.findAll
 */
export interface TrieNodeData<T extends unknown = number> {
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
export interface Trie<T extends unknown = number> {
  /**
   * Initialize a trie.
   */
  init(): void

  /**
   * Insert a string into the trie.
   *
   * @param str     the string to be inserted.
   * @param v       additional value of the string to be inserted. (!!!Don't set it to ZERO)
   * @param start   the starting position of the str. (default: 0)
   * @param end     the ending position of the str. (default: str.length)
   */
  insert(str: string, v: T, start?: number, end?: number): void

  /**
   * Find a word in the trie which exact match the str.slice(start, end),
   * if there is such a word, return its additional value,
   * otherwise return null.
   *
   * @param str     the string to be matched.
   * @param start   the starting position of the str. (default: 0)
   * @param end     the ending position of the str. (default: str.length)
   */
  match(str: string, start?: number, end?: number): T | null

  /**
   * Find word with smallest length in the trie which exact match the
   * str.slice(start, x), where the x is an integer in the range [start, _end).
   *
   * @param str     the string to be searched.
   * @param start   the starting position of the str. (default: 0)
   * @param end     the ending position of the str. (default: str.length)
   */
  find(str: string, start?: number, end?: number): TrieNodeData<T> | null

  /**
   * Find all words in the trie which exact match the
   * str.slice(start, x), where the x is an integer in the range [start, _end).
   *
   * @param str     the string to be searched.
   * @param start   the starting position of the str. (default: 0)
   * @param end     the ending position of the str. (default: str.length)
   */
  findAll(str: string, start?: number, end?: number): Array<TrieNodeData<T>>
}
