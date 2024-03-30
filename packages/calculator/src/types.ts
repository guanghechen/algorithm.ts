export interface IOperand<T> {
  readonly ZERO: T

  // x + y
  add(x: T, y: T): T

  // x - y
  sub(x: T, y: T): T

  // x / y
  div(x: T, y: T): T

  // x * y
  mul(x: T, y: T): T

  parse(expression: string, start: number, end: number): [nextStart: number, value: T]
}

export interface ICalculator<T> {
  calculate(expression: string): T
}
