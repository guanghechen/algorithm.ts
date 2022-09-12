export interface IOperator<T> {
  readonly ZERO: T

  readonly ONE: T

  // x + y
  add(x: T, y: T): T

  // x - y
  subtract(x: T, y: T): T

  // x / y
  divide(x: T, y: T): T

  // x * y
  multiple(x: T, y: T): T
}
