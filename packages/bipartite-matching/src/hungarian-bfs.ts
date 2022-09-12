import type { ICircularQueue } from '@algorithm.ts/queue'
import { CircularQueue } from '@algorithm.ts/queue'
import type { IBipartiteMatcher, IBipartiteMatching } from './types'

export class HungarianBfs implements IBipartiteMatcher {
  protected readonly _Q: ICircularQueue<number> = new CircularQueue()
  protected readonly _G: number[][] = []
  protected readonly _visited: number[] = []
  protected readonly _prev: number[] = []
  protected readonly _partner: number[] = []
  protected _N = 0

  /* istanbul ignore next */
  public destroy(): void {
    this._Q.destroy()
    this._G.length = 0
    this._visited.length = 0
    this._partner.length = 0
    this._N = -1
  }

  public init(N: number): void {
    if (!Number.isInteger(N) || N < 1) {
      throw new RangeError(
        `[HungarianBfs] The number of nodes (N) is expected to be a positive integer, but got (${N}).`,
      )
    }

    this._N = N
    this._Q.clear()
    this._G.length = N
    this._visited.length = N
    this._prev.length = N
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
    const { _N, _Q, _G, _partner, _visited, _prev } = this
    _partner.fill(-1, 0, _N)
    _visited.fill(-1, 0, _N)

    let total = 0
    for (let o = 0; o < _N; o += 1) {
      if (_partner[o] === -1) {
        if (match(o)) total += 1
      }
    }
    return total

    function match(o: number): boolean {
      _Q.clear()
      _Q.enqueue(o)
      _prev[o] = -1
      _visited[o] = o
      while (_Q.size > 0) {
        const u = _Q.dequeue()!
        for (let i = 0, g = _G[u], _end = g.length; i < _end; ++i) {
          const v = g[i]
          if (_visited[v] !== o) {
            _visited[v] = o
            const vv = _partner[v]
            if (vv >= 0) {
              // This is a matched point.
              _Q.enqueue(vv)
              _prev[vv] = u
            } else {
              // Find an unmatched point.
              for (let d = u, e = v; d !== -1; ) {
                const t = _partner[d]
                _partner[d] = e
                _partner[e] = d
                d = _prev[d]
                e = t
              }
              return true
            }
          }
        }
      }
      return false
    }
  }
}
