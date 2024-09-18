import type { IFindset } from './types/findset'

/**
 * Vanilla Findset, no heuristic operations, no fancy features.
 */
export class Findset implements IFindset {
  protected readonly _parent: number[]
  protected _size: number
  protected _destroyed: boolean

  constructor() {
    this._parent = [0]
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
    // eslint-disable-next-line no-return-assign
    return !y ? x : (this._parent[x] = this.root(y))
  }

  public destroy(): void {
    if (this._destroyed) return
    this._destroyed = true

    this._parent.length = 0
    this._size = 0
  }

  public init(size: number): void {
    if (this._destroyed) {
      throw new Error('[Findset] `init` is not allowed since it has been destroyed')
    }

    if (!Number.isInteger(size) || size < 1) {
      throw new RangeError(
        `[Findset] size is expected to be a positive integer, but got (${size}).`,
      )
    }

    this._size = size
    this._parent.length = Math.max(this._parent.length, size + 1)
    this._parent.fill(0, 1, size + 1)
  }

  public merge(x: number, y: number): number {
    const px: number = this.root(x)
    const py: number = this.root(y)
    if (px === py) return px

    // Randomly choose a new root node to get a uniform distribution in probability.
    if (Math.random() < 0.5) {
      this._parent[px] = py
      return py
    }

    this._parent[py] = px
    return px
  }
}
