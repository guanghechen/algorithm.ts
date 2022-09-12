import type { ICircularQueue } from '@algorithm.ts/queue'
import { CircularQueue } from '@algorithm.ts/queue'
import type { IIsap, IIsapEdge } from './types'

export class Isap implements IIsap {
  protected readonly _cur: number[] = [] // The next edge number to be considered of the edges starting from the i-th node.
  protected readonly _cnt: number[] = [] // Counting the points with specified distance.
  protected readonly _dist: number[] = [] // The distance from the target node to the i-th node.
  protected readonly _path: number[] = [] // An edge in an augmented path.
  protected readonly _edges: IIsapEdge[] = []
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
    this._cnt.length = n
    this._dist.length = n
    this._path.length = n
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
      const { _N, _source, _sink, _G, _edges, _dist, _path, _cur, _cnt } = this

      // Initialize.
      _cur.fill(0, 0, _N)
      _cnt.fill(0, 0, _N)

      this._bfs()
      for (let o = 0; o < _N; ++o) {
        if (_dist[o] < _N) _cnt[_dist[o]] += 1
      }

      for (let o = _source; _dist[o] < _N; ) {
        if (o === _sink) {
          _maxflow += this._augment()
          o = _source
        }

        let blocked = true
        const g = _G[o]
        for (let i = _cur[o], g = _G[o]; i < g.length; ++i) {
          const e = _edges[g[i]]
          if (e.cap > e.flow && _dist[o] === _dist[e.to] + 1) {
            blocked = false
            _cur[o] = i
            _path[e.to] = g[i]
            o = e.to
            break
          }
        }

        if (blocked) {
          let d = _N - 1
          for (const x of g) {
            const e = _edges[x]
            if (e.cap > e.flow && d > _dist[e.to]) d = _dist[e.to]
          }

          if (--_cnt[_dist[o]] === 0) break

          _dist[o] = d + 1
          _cnt[d + 1] += 1
          _cur[o] = 0
          if (o !== _source) o = _edges[_path[o]].from
        }
      }

      this._maxflow = _maxflow
      this._resolvedTimestamp = this._modifiedTimestamp
    }
    return this._maxflow
  }

  public mincut(): Array<Readonly<IIsapEdge>> {
    this.maxflow()
    const results: Array<Readonly<IIsapEdge>> = []
    const { _edges, _edgesTot } = this
    for (let i = 0; i < _edgesTot; ++i) {
      const e = _edges[i]
      if (e.cap > 0 && e.flow === e.cap) results.push(e)
    }
    return results
  }

  protected _bfs(): void {
    const { _N, _sink, _G, _edges, _Q, _dist } = this

    // Initialize the dist array.
    _dist.fill(-1, 0, _N)

    _Q.enqueue(_sink)
    _dist[_sink] = 0
    while (_Q.size > 0) {
      const o = _Q.dequeue()!
      for (const i of _G[o]) {
        const e = _edges[i]
        if (_dist[e.to] === -1 && e.cap === 0) {
          _dist[e.to] = _dist[o] + 1
          _Q.enqueue(e.to)
        }
      }
    }
  }

  protected _augment(): number {
    let mif = Number.POSITIVE_INFINITY
    const { _source, _sink, _edges, _path } = this
    for (let o = _sink; o !== _source; ) {
      const e = _edges[_path[o]]
      const remainCap = e.cap - e.flow
      if (mif > remainCap) mif = remainCap
      o = e.from
    }
    for (let o = _sink; o !== _source; ) {
      const x = _path[o]
      _edges[x].flow += mif
      _edges[x ^ 1].flow -= mif
      o = _edges[x].from
    }
    return mif
  }
}
