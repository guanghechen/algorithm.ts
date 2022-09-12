/**
 * The algorithm X that applied the dancing-link, it is also called as "DLX".
 * It is used to solve the exact-cover problem.
 *
 * Dancing-link: A cross doubly linked list, each column has a virtual node as
 * the head pointer, and at the top of all virtual nodes there is an additional
 * virtual node as the head pointer of the virtual node, which is also the head
 * pointer of the entire dancing-link. In the implementation of using an array
 * to simulate a linked list, the virtual node is represented by a column
 * number, and the head pointer of the dancing-link can be represented by 0.
 *
 * @see https://me.guanghechen.com/post/algorithm/dlx/
 */
export interface IDancingLinkX {
  /**
   * Release memory variables.
   */
  destroy(): void
  /**
   * Initialize the dancing-link.
   * @param columnCount number of columns
   */
  init(columnCount: number): void
  /**
   * Add a row to the dancing-link.
   *
   * It should be noted that after solving the exact-cover problem, the
   * result is a list of selected row numbers, so the row number should be
   * specified as a value that can carry information.
   *
   * @param rowNo     the row number
   * @param columns   columns on the row
   */
  addRow(rowNo: number, columns: ReadonlyArray<number>): void
  /**
   * Try to find a precise coverage.
   *
   * When a solution is found, return the row numbers of all selected rows,
   * otherwise return null.
   */
  solve(): number[] | null
}
