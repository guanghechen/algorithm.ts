import type { IBipartiteMatcher, IBipartiteMatching } from './types'

export class HungarianDfs implements IBipartiteMatcher {
  protected readonly _G: number[][] = []
  protected readonly _visited: boolean[] = []
  protected readonly _partner: number[] = []
  protected _N = 0

  /* istanbul ignore next */
  public clear(): void {
    this._G.length = 0
    this._visited.length = 0
    this._partner.length = 0
    this._N = -1
  }

  public init(N: number): void {
    if (!Number.isInteger(N) || N < 1) {
      throw new RangeError(
        `[HungarianDfs] The number of nodes (N) is expected to be a positive integer, but got (${N}).`,
      )
    }

    this._N = N
    this._G.length = N
    this._visited.length = N
    this._partner.length = N

    const G = this._G
    for (let i = 0; i < N; ++i) {
      if (G[i] === undefined) G[i] = []
      else G[i].length = 0
    }
  }

  public addEdge(u: number, v: number): void {
    this._G[u].push(v)
    this._G[v].push(u)
  }

  public maxMatch(): IBipartiteMatching {
    const { _partner } = this
    const count = this._hungarian()
    return { count, partners: _partner.slice() }
  }

  public isPerfectMatch(): boolean {
    const { _G, _N } = this
    if (_N % 2 === 1) return false

    const targetPairs: number = _N >> 1
    if (_G.some(g => g.length <= 0)) return false
    return this._hungarian() === targetPairs
  }

  protected _hungarian(): number {
    const { _N, _G, _partner, _visited } = this
    _partner.fill(-1, 0, _N)

    let total = 0
    for (let u = 0; u < _N; u += 1) {
      if (_partner[u] === -1) {
        _visited.fill(false, 0, _N)
        _visited[u] = true
        if (match(u)) total += 1
      }
    }
    return total

    function match(u: number): boolean {
      for (const v of _G[u]) {
        if (_visited[v]) continue
        _visited[v] = true

        if (_partner[v] === -1 || match(_partner[v])) {
          _partner[u] = v
          _partner[v] = u
          return true
        }
      }
      return false
    }
  }
}
