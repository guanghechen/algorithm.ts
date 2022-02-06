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
   * Initialize the dancing-link.
   * @param totalColumns   number of columns
   */
  init(totalColumns: number): void

  /**
   * Release memory variables.
   */
  destroy(): void

  /**
   * Add a row to the dancing-link.
   *
   * It should be noted that after solving the exact-cover problem, the
   * result is a list of selected row numbers, so the row number should be
   * specified as a value that can carry information.
   *
   * @param r         the row number
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

/**
 * Generate an object that encapsulates the DLX algorithm.
 *
 * @param MAX_N   maximum number of nodes in the dancing-link
 * @returns
 */
export function createDLX(MAX_N: number): IDancingLinkX {
  // The number of nodes in the dancing-link (including the virtual nodes on
  // the column).
  let sz: number

  const selectedRowNos: number[] = new Array(MAX_N) // list of row numbers of selected rows
  let countOfSelectedRows: number // the number of selected rows

  const count: number[] = new Array(MAX_N) // the number of nodes of a column in the dancing-link
  const row: number[] = new Array(MAX_N) // the row number of a node in the dancing-link
  const col: number[] = new Array(MAX_N) // the column number of a node in the dancing-link
  const L: number[] = new Array(MAX_N) // left pointer of cross-link list
  const R: number[] = new Array(MAX_N) // right pointer of cross-link list
  const U: number[] = new Array(MAX_N) // up pointer of cross-link list
  const D: number[] = new Array(MAX_N) // down pointer of cross-link list
  return { init, destroy, addRow, solve }

  /**
   * @see IDancingLinkX#init
   * @public
   */
  function init(_totalColumns: number): void {
    sz = _totalColumns + 1

    for (let i = 0; i < sz; ++i) {
      L[i] = i - 1
      R[i] = i + 1
      U[i] = i
      D[i] = i
    }
    R[_totalColumns] = 0
    L[0] = _totalColumns

    count.fill(0, 0, sz)
  }

  /**
   * @see IDancingLinkX#destroy
   * @public
   */
  function destroy(): void {
    sz = 0
    selectedRowNos.length = 0
    count.length = 0
    row.length = 0
    col.length = 0
    L.length = 0
    R.length = 0
    U.length = 0
    D.length = 0
  }

  /**
   * @see IDancingLinkX#addRow
   * @public
   */
  function addRow(r: number, columns: ReadonlyArray<number>): void {
    const first = sz
    for (let i = 0; i < columns.length; ++i, ++sz) {
      const c = columns[i]
      row[sz] = r
      col[sz] = c
      count[c] += 1

      // Connect left and right nodes
      L[sz] = sz - 1
      R[sz] = sz + 1

      // Connect top and bottom nodes,
      // c is the virtual node on the c-th column, and is also the head pointer
      // of the linked list of the column, so at this time U[c] is the last
      // element of the column
      D[sz] = c
      D[U[c]] = sz
      U[sz] = U[c]
      U[c] = sz
    }

    // Since this is a circular linked list, the first and last columns of the
    // current row are connected to each other.
    R[sz - 1] = first
    L[first] = sz - 1
  }

  /**
   * @see IDancingLinkX#solve
   * @public
   */
  function solve(): number[] | null {
    if (sz === 0) return null
    if (!algorithmX(0)) return null
    return selectedRowNos.slice(0, countOfSelectedRows)
  }

  /**
   * Remove a column from the dancing-link.
   * @param c   column number
   * @private
   */
  function removeColumn(c: number): void {
    L[R[c]] = L[c]
    R[L[c]] = R[c]
    for (let i = D[c]; i !== c; i = D[i]) {
      for (let j = R[i]; j !== i; j = R[j]) {
        U[D[j]] = U[j]
        D[U[j]] = D[j]
        count[col[j]] -= 1
      }
    }
  }

  /**
   * Restore a previously deleted column
   * @param c   column number
   * @private
   */
  function restoreColumn(c: number): void {
    for (let i = U[c]; i !== c; i = U[i]) {
      for (let j = L[i]; j !== i; j = L[j]) {
        count[col[j]] += 1
        U[D[j]] = j
        D[U[j]] = j
      }
    }
    L[R[c]] = c
    R[L[c]] = c
  }

  /**
   * Algorithm X.
   *
   * Recursively solve the problem of precise coverage, enumerate which rows are
   * selected in the recursive process, remove the selected rows and all the
   * columns on the rows, and restore these rows and columns during the
   * backtrack.
   *
   * @param dep   recursion depth
   * @private
   */
  function algorithmX(dep: number): boolean {
    // Find a solution when the dancing-link is empty.
    if (R[0] === 0) {
      // Record the length of the solution.
      countOfSelectedRows = dep
      return true
    }

    /**
     * Optimization: Find the column with the least number of nodes, and try to
     * cover from this column.
     */
    let c = R[0]
    for (let i = R[0]; i !== 0; i = R[i]) {
      if (count[i] < count[c]) c = i
    }

    // Remove this column.
    removeColumn(c)
    for (let i = D[c]; i !== c; i = D[i]) {
      selectedRowNos[dep] = row[i]
      for (let j = R[i]; j !== i; j = R[j]) removeColumn(col[j])

      // Recursively processing.
      if (algorithmX(dep + 1)) return true

      // Backtrack.
      for (let j = L[i]; j !== i; j = L[j]) restoreColumn(col[j])
    }
    // Backtrack.
    restoreColumn(c)

    return false
  }
}
