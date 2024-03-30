export interface IIntervalUpdateSingleQueryOperator<T> {
  readonly ZERO: T

  // x + y
  add(x: T, y: T): T
}

export interface IIntervalUpdateSingleQueryProps<T> {
  readonly operator: IIntervalUpdateSingleQueryOperator<T>
}

/**
 * A binary search tree that supports interval-update and single-point-query.
 */
export class IntervalUpdateSingleQuery<T> {
  protected readonly _operator: IIntervalUpdateSingleQueryOperator<T>
  protected readonly _nodes: T[]

  constructor(props: IIntervalUpdateSingleQueryProps<T>) {
    this._operator = props.operator
    this._nodes = [this._operator.ZERO]
  }

  public init(N: number): void {
    if (N < 1) {
      throw new RangeError(
        `[IntervalUpdateSingleQuery] N is expected to be a positive integer, but got (${N}).`,
      )
    }
    this._nodes.length = N + 1
    this._nodes.fill(this._operator.ZERO, 1, this._nodes.length)
  }

  /**
   * Add value to the numbers which index in the range of [1, xth].
   * @param xth
   * @param value
   */
  public add(xth: number, value: T): void {
    const { _operator, _nodes } = this
    for (let i = xth; i > 0; i -= i & -i) {
      _nodes[i] = _operator.add(_nodes[i], value)
    }
  }

  /**
   * Get the value of the xth number.
   * @param xth
   */
  public query(xth: number): T {
    if (xth < 1) return this._operator.ZERO

    const { _operator, _nodes } = this
    let result: T = _operator.ZERO
    for (let i = xth, _end = _nodes.length; i < _end; i += i & -i) {
      result = _operator.add(result, _nodes[i])
    }
    return result
  }
}
