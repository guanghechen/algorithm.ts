import type { IHeuristicFindset } from './types/heuristic'

export class HeuristicFindset implements IHeuristicFindset {
  protected readonly _parent: number[]
  protected readonly _count: number[]
  protected _size: number
  protected _destroyed: boolean

  constructor() {
    this._parent = [0]
    this._count = [0]
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
    this._count.length = 0
    this._size = 0
  }

  public init(size: number): void {
    if (this._destroyed) {
      throw new Error('[HeuristicFindset] `init` is not allowed since it has been destroyed')
    }

    if (!Number.isInteger(size) || size < 1) {
      throw new RangeError(
        `[HeuristicFindset] size is expected to be a positive integer, but got (${size}).`,
      )
    }

    this._size = size
    this._parent.length = Math.max(this._parent.length, size + 1)
    this._parent.fill(0, 1, size + 1)
    this._count.length = Math.max(this._count.length, size + 1)
    this._count.fill(1, 1, size + 1)
  }

  public merge(x: number, y: number): number {
    const px: number = this.root(x)
    const py: number = this.root(y)
    if (px === py) return px

    // Heuristic combination.
    if (this._count[px] < this._count[py]) {
      this._count[py] += this._count[px]
      this._count[px] = 0
      this._parent[px] = py
      return py
    }

    this._count[px] += this._count[py]
    this._count[py] = 0
    this._parent[py] = px
    return px
  }

  public count(x: number): number {
    const px: number = this.root(x)
    return this._count[px] ?? 0
  }
}
