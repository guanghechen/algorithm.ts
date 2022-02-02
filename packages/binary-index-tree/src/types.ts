/**
 * A Binary Index tree is a tree array, used to efficiently maintain the prefix
 * sum. Such as support single point update with interval query, or interval
 * update with single point query. The amortized complexity of each operation is
 * $O(log N)$.
 *
 * The problem that the Binary Index Tree can solve is a subset of the Segment
 * Tree. Its advantage is that the complexity constant is smaller, and the
 * implementation is simpler and easier to understand.
 */
export interface IBinaryIndexTree<T extends number | bigint> {
  /**
   * Initialize the binary search tree.
   *
   * @param N the maximum node identifier of the tree
   */
  init(N: number): void
  /**
   * Add value to the xth number.
   *
   * @param xth
   * @param value
   */
  add(xth: number, value: T): void
  /**
   * Calculate the sum of the first x numbers.
   *
   * @param xth
   */
  query(xth: number): T
}
