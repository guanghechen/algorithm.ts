import type { IEnhancedFindset } from './types/enhanced'

/**
 * An enhanced findset support to query the set of all nodes on a given tree.
 */
export class EnhancedFindset implements IEnhancedFindset {
  protected readonly _parent: number[]
  protected readonly _sets: Array<Set<number>>
  protected _size: number
  protected _destroyed: boolean

  constructor() {
    this._parent = [0]
    this._sets = [new Set<number>()]
    this._size = 0
    this._destroyed = false
  }

  public get destroyed(): boolean {
    return this._destroyed
  }

  public get size(): number {
    return this._size
  }

  public root(x: number): number {
    const y = this._parent[x]
    return y ? (this._parent[x] = this.root(y)) : x
  }

  public destroy(): void {
    if (this._destroyed) return
    this._destroyed = true

    for (const s of this._sets) s.clear()
    this._parent.length = 0
    this._sets.length = 0
    this._size = 0
  }

  public init(size: number): void {
    if (this._destroyed) {
      throw new Error('[EnhancedFindset] `init` is not allowed since it has been destroyed')
    }

    if (!Number.isInteger(size) || size < 1) {
      throw new RangeError(
        `[EnhancedFindset] size is expected to be a positive integer, but got (${size}).`,
      )
    }

    this._size = size
    this._parent.length = Math.max(this._parent.length, size + 1)
    this._parent.fill(0, 1, size + 1)

    const sets: Array<Set<number>> = this._sets
    for (const set of sets) set.clear()
    for (let i = sets.length; i <= size; ++i) sets.push(new Set<number>())
    for (let x = 1; x <= size; ++x) sets[x].add(x)
  }

  public merge(x: number, y: number): number {
    const px: number = this.root(x)
    const py: number = this.root(y)
    if (px === py) return px

    // Heuristic combination.
    const sets: Array<Set<number>> = this._sets
    const sx: Set<number> = sets[px]
    const sy: Set<number> = sets[py]

    if (sx.size < sy.size) {
      for (const t of sx) sy.add(t)
      sx.clear()
      this._parent[px] = py
      return py
    }

    for (const t of sy) sx.add(t)
    sy.clear()
    this._parent[py] = px
    return px
  }

  public count(x: number): number {
    const px: number = this.root(x)
    return this._sets[px]?.size ?? 0
  }

  public getSetOf(x: number): ReadonlySet<number> | undefined {
    const px: number = this.root(x)
    return this._sets[px]
  }
}
