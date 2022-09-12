import type { ICircularQueue } from '@algorithm.ts/queue'
import { CircularQueue } from '@algorithm.ts/queue'
import type { IDinic, IDinicEdge } from './types'

export class Dinic implements IDinic {
  protected readonly _cur: number[] = [] // The next edge number to be considered of the edges starting from the i-th node.
  protected readonly _dist: number[] = [] // The distance from the source node to the i-th node.
  protected readonly _edges: IDinicEdge[] = []
  protected readonly _G: number[][] = []
  protected readonly _Q: ICircularQueue<number> = new CircularQueue()
  protected _N: number // The number of nodes in a network flow
  protected _source: number // The source point in a network flow
  protected _sink: number // The sink in a network flow
  protected _maxflow: number
  protected _edgesTot: number
  protected _modifiedTimestamp: number
  protected _resolvedTimestamp: number

  constructor() {
    this._N = 0
    this._source = -1
    this._sink = -1
    this._maxflow = 0
    this._edgesTot = 0
    this._modifiedTimestamp = 0
    this._resolvedTimestamp = -1
  }

  public init(source: number, sink: number, n: number): void {
    this._N = n
    this._source = source
    this._sink = sink
    this._maxflow = 0
    this._edgesTot = 0
    this._modifiedTimestamp = 0
    this._resolvedTimestamp = -1

    // Resize arrays.
    this._cur.length = n
    this._dist.length = n
    this._G.length = n

    this._Q.init()
    this._Q.resize(n + 1)
    for (let i = 0; i < n; i++) this._G[i] = []
  }

  public addEdge(from: number, to: number, cap: number): void {
    const { _G, _edges, _edgesTot } = this
    _G[from].push(_edgesTot)
    _G[to].push(_edgesTot + 1)
    _edges[_edgesTot] = { from, to, cap, flow: 0 }
    _edges[_edgesTot + 1] = { from: to, to: from, cap: 0, flow: 0 }

    this._edgesTot += 2
    this._modifiedTimestamp += 1
  }

  public maxflow(): number {
    if (this._resolvedTimestamp < this._modifiedTimestamp) {
      let { _maxflow } = this
      const { _N, _source, _cur } = this
      while (this._bfs()) {
        _cur.fill(0, 0, _N)
        _maxflow += this._dfs(_source, Number.MAX_SAFE_INTEGER)
      }

      this._maxflow = _maxflow
      this._resolvedTimestamp = this._modifiedTimestamp
    }
    return this._maxflow
  }

  public mincut(): Array<Readonly<IDinicEdge>> {
    this.maxflow()
    const results: Array<Readonly<IDinicEdge>> = []
    const { _edges, _edgesTot } = this
    for (let i = 0; i < _edgesTot; ++i) {
      const e = _edges[i]
      if (e.cap > 0 && e.flow === e.cap) results.push(e)
    }
    return results
  }

  protected _bfs(): boolean {
    const { _N, _source, _sink, _G, _edges, _Q, _dist } = this

    // Initialize the dist array.
    _dist.fill(-1, 0, _N)

    _Q.enqueue(_source)
    _dist[_source] = 0
    while (_Q.size > 0) {
      const o = _Q.dequeue()!
      for (const i of _G[o]) {
        const e = _edges[i]
        if (_dist[e.to] === -1 && e.cap > e.flow) {
          _dist[e.to] = _dist[o] + 1
          _Q.enqueue(e.to)
        }
      }
    }

    return _dist[_sink] !== -1
  }

  protected _dfs(o: number, mif: number): number {
    if (o === this._sink || mif === 0) return mif

    const { _G, _edges, _cur, _dist } = this

    let flow = 0
    for (let g = _G[o]; _cur[o] < g.length; ++_cur[o]) {
      const x = g[_cur[o]]
      const e = _edges[x]
      if (_dist[e.to] === _dist[o] + 1) {
        const remain = e.cap - e.flow
        const f = this._dfs(e.to, mif < remain ? mif : remain)
        if (f <= 0) continue

        e.flow += f
        _edges[x ^ 1].flow -= f
        flow += f
        // eslint-disable-next-line no-param-reassign
        mif -= f
        if (mif === 0) break
      }
    }
    return flow
  }
}
