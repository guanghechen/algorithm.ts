export type IKeyOf<T, K = number> = (element: T) => K

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
