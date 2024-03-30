export interface ISingleUpdateIntervalQueryOperator<T> {
  readonly ZERO: T

  // x + y
  add(x: T, y: T): T
}

export interface ISingleUpdateIntervalQueryProps<T> {
  readonly operator: ISingleUpdateIntervalQueryOperator<T>
}

/**
 * A binary search tree that supports single-point-update and interval-query.
 */
export class SingleUpdateIntervalQuery<T> {
  protected readonly _operator: ISingleUpdateIntervalQueryOperator<T>
  protected readonly _nodes: T[]

  constructor(props: ISingleUpdateIntervalQueryProps<T>) {
    this._operator = props.operator
    this._nodes = [this._operator.ZERO]
  }

  public init(N: number): void {
    if (N < 1) {
      throw new RangeError(
        `[SingleUpdateIntervalQuery] N is expected to be a positive integer, but got (${N}).`,
      )
    }
    this._nodes.length = N + 1
    this._nodes.fill(this._operator.ZERO, 1, this._nodes.length)
  }

  /**
   * Add value to the xth number
   * @param xth
   * @param value
   */
  public add(xth: number, value: T): void {
    if (xth < 1) return

    const { _operator, _nodes } = this
    for (let i = xth, _end = _nodes.length; i < _end; i += i & -i) {
      _nodes[i] = _operator.add(_nodes[i], value)
    }
  }

  /**
   * Calculate the prefix sum of the first x elements of the array.
   * @param xth
   */
  public query(xth: number): T {
    const { _operator, _nodes } = this
    let result = _operator.ZERO
    for (let i = xth; i > 0; i -= i & -i) {
      result = _operator.add(result, _nodes[i])
    }
    return result
  }
}
