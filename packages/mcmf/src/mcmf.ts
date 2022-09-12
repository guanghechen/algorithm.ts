import type { ICircularQueue } from '@algorithm.ts/queue'
import { CircularQueue } from '@algorithm.ts/queue'
import type { IMcmf, IMcmfEdge } from './types'

export interface IMcmfOptions {
  /**
   * A big number, representing the unreachable cost.
   */
  INF?: number
}

const DEFAULT_INF = Math.floor(Number.MAX_SAFE_INTEGER / 2)

export class Mcmf implements IMcmf {
  protected readonly _INF: number
  protected readonly _inq: boolean[] = [] // Whether if the i-th node is in the queue.
  protected readonly _dist: number[] = [] // The distance from the target node to the i-th node.
  protected readonly _path: number[] = [] // An edge in an augmented path.
  protected readonly _edges: IMcmfEdge[] = []
  protected readonly _G: number[][] = []
  protected readonly _Q: ICircularQueue<number> = new CircularQueue()
  protected _N: number // The number of nodes in a network flow
  protected _source: number // The source point in a network flow
  protected _sink: number // The sink in a network flow
  protected _maxflow: number
  protected _mincost: number
  protected _edgesTot: number
  protected _modifiedTimestamp: number
  protected _resolvedTimestamp: number

  constructor(options: IMcmfOptions = {}) {
    const { INF = DEFAULT_INF } = options
    this._INF = INF
    this._N = 0
    this._source = -1
    this._sink = -1
    this._maxflow = 0
    this._mincost = 0
    this._edgesTot = 0
    this._modifiedTimestamp = 0
    this._resolvedTimestamp = -1
  }

  public init(source: number, sink: number, n: number): void {
    this._N = n
    this._source = source
    this._sink = sink
    this._maxflow = 0
    this._mincost = 0
    this._edgesTot = 0
    this._modifiedTimestamp = 0
    this._resolvedTimestamp = -1

    // Resize arrays.
    this._inq.length = n
    this._dist.length = n
    this._path.length = n
    this._G.length = n

    this._inq.fill(false, 0, n)
    this._Q.init()
    this._Q.resize(n + 1)
    for (let i = 0; i < n; i++) this._G[i] = []
  }

  public addEdge(from: number, to: number, cap: number, cost: number): void {
    const { _G, _edges, _edgesTot } = this
    _G[from].push(_edgesTot)
    _G[to].push(_edgesTot + 1)
    _edges[_edgesTot] = { from, to, cap, flow: 0, cost }
    _edges[_edgesTot + 1] = { from: to, to: from, cap: 0, flow: 0, cost: -cost }

    this._edgesTot += 2
    this._modifiedTimestamp += 1
  }

  public minCostMaxFlow(): { mincost: number; maxflow: number } {
    if (this._resolvedTimestamp < this._modifiedTimestamp) {
      let { _maxflow, _mincost } = this
      const { _INF, _source, _sink, _edges, _dist, _path } = this

      while (this._bellmanFord()) {
        let mif = _INF
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
        _maxflow += mif
        _mincost += mif * _dist[_sink]
      }

      this._maxflow = _maxflow
      this._mincost = _mincost
      this._resolvedTimestamp = this._modifiedTimestamp
    }
    return { mincost: this._mincost, maxflow: this._maxflow }
  }

  public mincut(): Array<Readonly<IMcmfEdge>> {
    void this.minCostMaxFlow()
    const results: Array<Readonly<IMcmfEdge>> = []
    const { _edges, _edgesTot } = this
    for (let i = 0; i < _edgesTot; ++i) {
      const e = _edges[i]
      if (e.cap > 0 && e.flow === e.cap) results.push(e)
    }
    return results
  }

  /**
   * Negative loops should not appear in the residual network,
   * so there is no need to check if there are negative loops.
   */
  protected _bellmanFord(): boolean {
    const { _INF, _N, _source, _sink, _G, _edges, _Q, _dist, _path, _inq } = this

    // Initialize the dist array.
    _dist.fill(_INF, 0, _N)

    _Q.enqueue(_source)
    _dist[_source] = 0
    _inq[_source] = true
    while (_Q.size > 0) {
      const o = _Q.dequeue()!
      for (let i = 0, g = _G[o]; i < g.length; ++i) {
        const x = g[i]
        const e = _edges[x]
        if (e.cap === e.flow) continue

        const candidateDist = _dist[o] + e.cost
        if (_dist[e.to] > candidateDist) {
          _dist[e.to] = candidateDist
          _path[e.to] = x

          if (_inq[e.to]) continue
          _inq[e.to] = true
          _Q.enqueue(e.to)
        }
      }
      _inq[o] = false
    }

    return _dist[_sink] !== _INF
  }
}
