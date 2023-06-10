export interface IReadonlyCollection<T> {
  /**
   * Count the element in the collection.
   * @getter
   */
  readonly size: number

  /**
   * Iterable.
   */
  [Symbol.iterator](): IterableIterator<T>
}

export interface ICollection<T> extends IReadonlyCollection<T> {
  /**
   * Release memory.
   */
  destroy(): void
  /**
   * Remove all elements.
   * Notice that this method does not release memory.
   */
  clear(): void
}
