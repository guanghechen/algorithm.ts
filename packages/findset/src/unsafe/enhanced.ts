import type { IEnhancedFindset } from '../types'

/**
 * An enhanced findset support to query the set of all nodes on a given tree.
 */
export class UnsafeEnhancedFindset implements IEnhancedFindset {
  protected readonly _parent: number[] = []
  protected readonly _sets: Array<Set<number>> = []
  protected _N = 0

  public init(N: number): void {
    const { _sets } = this
    for (const set of _sets) set.clear()
    for (let i = _sets.length; i <= N; ++i) _sets[i] = new Set<number>()
    for (let x = 1; x <= N; ++x) _sets[x].add(x)

    this._N = N
    this._parent.length = N + 1
    this._sets.length = N + 1
    this._parent.fill(0)
  }

  public destroy(): void {
    for (const s of this._sets) s.clear()
    this._parent.length = 0
    this._sets.length = 0
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
    const { _sets } = this
    if (_sets[px].size > _sets[py].size) {
      const t: number = px
      px = py
      py = t
    }

    // Merge two set.
    for (const t of _sets[px]) _sets[py].add(t)
    _sets[px].clear()
    this._parent[px] = py
    return py
  }

  public count(x: number): number {
    const px = this.root(x)
    return this._sets[px].size
  }

  public getSetOf(x: number): ReadonlySet<number> | undefined {
    const px: number = this.root(x)
    return this._sets[px]
  }

  private _root(x: number): number {
    const y = this._parent[x]
    return y === 0 ? x : (this._parent[x] = this._root(y))
  }
}
