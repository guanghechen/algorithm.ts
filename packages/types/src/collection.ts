export interface ICollection<T> extends Iterable<T> {
  /**
   * Count the element in the collection.
   * @getter
   */
  readonly size: number
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
