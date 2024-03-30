/**
 * Make an object deep-readonly.
 */
export type DeepReadonly<T extends object> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : Readonly<T[P]>
}
/**
 * Make all properties in `T` mutable.
 * @see https://stackoverflow.com/a/46634877
 */
export type Mutable<T extends object> = { -readonly [P in keyof T]: T[P] }

/**
 * Get element type of an array
 */
export type ElementOfArray<T extends ReadonlyArray<unknown> | string> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : T extends string
  ? string
  : never

/**
 * Make a set of properties by key `K` become optional from `T`.
 */
export type PickPartial<T extends object, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Type for a comparison function.
 *
 * - -1 or other negative number if the first argument is less than the second
 * - 0 if they are equal,
 * - 1 or other positive number if the first argument is greater than the second.
 */
export type ICompare<T> = (x: T, y: T) => -1 | 0 | 1 | number

/**
 * Type for an equality checking function.
 * It should return true if the two arguments are equal, and false otherwise.
 */
export type IEquals<T> = (x: T, y: T) => boolean
