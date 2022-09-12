import type { IHeuristicFindset } from '../types'

export class UnsafeHeuristicFindset implements IHeuristicFindset {
  protected readonly _parent: number[] = []
  protected readonly _count: number[] = []
  protected _N = 0

  public init(N: number): void {
    this._N = N
    this._parent.length = N + 1
    this._count.length = N + 1
    this._parent.fill(0)
    this._count.fill(1)
    this._count[0] = 0
  }

  public destroy(): void {
    this._parent.length = 0
    this._count.length = 0
    this._N = 0
  }

  public root(x: number): number {
    return this._root(x)
  }

  public merge(x: number, y: number): number {
    let px = this.root(x)
    let py = this.root(y)
    if (px === py) return px

    // Heuristic combination.
    if (this._count[px] > this._count[py]) {
      const t: number = px
      px = py
      py = t
    }

    this._count[py] += this._count[px]
    this._count[px] = 0
    this._parent[px] = py
    return py
  }

  public count(x: number): number {
    const px = this.root(x)
    return this._count[px]
  }

  private _root(x: number): number {
    const y = this._parent[x]
    return y === 0 ? x : (this._parent[x] = this._root(y))
  }
}
