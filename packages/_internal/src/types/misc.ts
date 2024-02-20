export type ICompare<T> = (x: T, y: T) => -1 | 0 | 1 | number
export type IEquals<T> = (x: T, y: T) => boolean

/**
 * Make all properties in `T` mutable.
 * @see https://stackoverflow.com/a/46634877
 */
export type Mutable<T extends object> = { -readonly [P in keyof T]: T[P] }

/**
 * Make a set of properties by key `K` become optional from `T`.
 */
export type PickPartial<T extends object, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make an object deep-readonly.
 */
export type DeepReadonly<T extends object> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : Readonly<T[P]>
}
