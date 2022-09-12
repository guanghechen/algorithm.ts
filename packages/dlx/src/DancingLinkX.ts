import type { IDancingLinkX } from '@algorithm.ts/dlx'

export interface IDancingLinkXProps {
  /**
   * Maximum number of nodes in the dancing-link.
   */
  MAX_N: number
}

/**
 * An implementation of the Dancing-Link algorithm.
 *
 * !!!NOTE
 *  - Row number start from 1.
 *  - Column number start from 1.
 */
export class DancingLinkX implements IDancingLinkX {
  protected readonly _count: number[] // the number of nodes of a column in the dancing-link
  protected readonly _row: number[] // the _row number of a node in the dancing-link
  protected readonly _col: number[] // the column number of a node in the dancing-link
  protected readonly _L: number[] // left pointer of cross-link list
  protected readonly _R: number[] // right pointer of cross-link list
  protected readonly _U: number[] // up pointer of cross-link list
  protected readonly _D: number[] // down pointer of cross-link list
  protected _sz: number // The number of nodes in the dancing-link (including the virtual nodes on the column)

  constructor(props: IDancingLinkXProps) {
    const { MAX_N } = props
    this._count = new Array(MAX_N)
    this._row = new Array(MAX_N)
    this._col = new Array(MAX_N)
    this._L = new Array(MAX_N)
    this._R = new Array(MAX_N)
    this._U = new Array(MAX_N)
    this._D = new Array(MAX_N)
    this._sz = 0
  }

  public destroy(): void {
    this._sz = 0
    this._count.length = 0
    this._row.length = 0
    this._col.length = 0
    this._L.length = 0
    this._R.length = 0
    this._U.length = 0
    this._D.length = 0
  }

  public init(columnCount: number): void {
    const { _L, _R, _U, _D, _count } = this
    const _sz = columnCount + 1

    for (let i = 0; i < _sz; ++i) {
      _L[i] = i - 1
      _R[i] = i + 1
      _U[i] = i
      _D[i] = i
    }
    _R[columnCount] = 0
    _L[0] = columnCount

    _count.fill(0, 0, _sz)
    this._sz = _sz
  }

  public addRow(r: number, columns: ReadonlyArray<number>): void {
    const { _count, _row, _col, _L, _R, _U, _D } = this
    let { _sz } = this
    const first = _sz
    for (let i = 0; i < columns.length; ++i, ++_sz) {
      const c = columns[i]
      _row[_sz] = r
      _col[_sz] = c
      _count[c] += 1

      // Connect left and right nodes
      _L[_sz] = _sz - 1
      _R[_sz] = _sz + 1

      // Connect top and bottom nodes,
      // c is the virtual node on the c-th column, and is also the head pointer
      // of the linked list of the column, so at this time _U[c] is the last
      // element of the column
      _D[_sz] = c
      _D[_U[c]] = _sz
      _U[_sz] = _U[c]
      _U[c] = _sz
    }

    // Since this is a circular linked list, the first and last columns of the
    // current _row are connected to each other.
    _R[_sz - 1] = first
    _L[first] = _sz - 1
    this._sz = _sz
  }

  public solve(): number[] | null {
    if (this._sz === 0) return null
    const selectedRowNos: number[] = []
    return this._algorithmX(0, selectedRowNos) ? selectedRowNos : null
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
  protected _algorithmX(dep: number, selectedRowNos: number[]): boolean {
    const { _count, _row, _col, _L, _R, _D } = this

    // Find a solution when the dancing-link is empty.
    if (_R[0] === 0) {
      // Clip the length of the solution.
      // eslint-disable-next-line no-param-reassign
      selectedRowNos.length = dep
      return true
    }

    /**
     * Optimization: Find the column with the least number of nodes, and try to
     * cover from this column.
     */
    let c = _R[0]
    for (let i = _R[0]; i !== 0; i = _R[i]) {
      if (_count[i] < _count[c]) c = i
    }

    // Remove this column.
    this._removeColumn(c)
    for (let i = _D[c]; i !== c; i = _D[i]) {
      // eslint-disable-next-line no-param-reassign
      selectedRowNos[dep] = _row[i]
      for (let j = _R[i]; j !== i; j = _R[j]) this._removeColumn(_col[j])

      // Recursively processing.
      if (this._algorithmX(dep + 1, selectedRowNos)) return true

      // Backtrack.
      for (let j = _L[i]; j !== i; j = _L[j]) this._restoreColumn(_col[j])
    }
    // Backtrack.
    this._restoreColumn(c)

    return false
  }

  /**
   * Remove a column from the dancing-link.
   * @param c   column number
   * @private
   */
  protected _removeColumn(c: number): void {
    const { _count, _col, _L, _R, _U, _D } = this
    _L[_R[c]] = _L[c]
    _R[_L[c]] = _R[c]
    for (let i = _D[c]; i !== c; i = _D[i]) {
      for (let j = _R[i]; j !== i; j = _R[j]) {
        _U[_D[j]] = _U[j]
        _D[_U[j]] = _D[j]
        _count[_col[j]] -= 1
      }
    }
  }

  /**
   * Restore a previously deleted column
   * @param c   column number
   * @private
   */
  protected _restoreColumn(c: number): void {
    const { _count, _col, _L, _R, _U, _D } = this
    for (let i = _U[c]; i !== c; i = _U[i]) {
      for (let j = _L[i]; j !== i; j = _L[j]) {
        _count[_col[j]] += 1
        _U[_D[j]] = j
        _D[_U[j]] = j
      }
    }
    _L[_R[c]] = c
    _R[_L[c]] = c
  }
}
