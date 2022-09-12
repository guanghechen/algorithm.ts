import type { IFindset } from '../types'

/**
 * Vanilla Findset, no heuristic operations, no fancy features.
 */
export class UnsafeVanillaFindset implements IFindset {
  protected readonly _parent: number[] = []
  protected _N = 0

  public init(N: number): void {
    this._N = N
    this._parent.length = N + 1
    this._parent.fill(0)
  }

  public destroy(): void {
    this._parent.length = 0
    this._N = 0
  }

  public root(x: number): number {
    return this._root(x)
  }

  public merge(x: number, y: number): number {
    let px = this.root(x)
    let py = this.root(y)
    if (px === py) return px

    // Randomly choose a new root node to get a uniform distribution in probability.
    if (Math.random() < 0.5) {
      const t: number = px
      px = py
      py = t
    }

    this._parent[px] = py
    return py
  }

  private _root(x: number): number {
    const y = this._parent[x]
    return y === 0 ? x : (this._parent[x] = this._root(y))
  }
}
