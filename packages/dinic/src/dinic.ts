import type { CircularQueue } from '@algorithm.ts/circular-queue'
import { createCircularQueue } from '@algorithm.ts/circular-queue'
import type { Dinic, DinicContext, DinicEdge } from './types'

export function createDinic(): Dinic {
  let _source: number // The source point in a network flow
  let _target: number // The sink in a network flow
  let _n: number // The number of nodes in a network flow
  let _m: number // The number of edges in a network flow (not including the reverse edges).
  let _maxflow: number
  let _edgeTot: number
  const _cur: number[] = [] // The next edge number to be considered of the edges starting from the i-th node.
  const _dist: number[] = [] // The distance from the source node to the i-th node.
  const _edges: DinicEdge[] = []
  const _G: number[][] = []
  const _Q: CircularQueue<number> = createCircularQueue()
  return { init, addEdge, maxFlow, solve }

  function init(source: number, target: number, n: number, m: number): void {
    _source = source
    _target = target
    _n = n
    _m = _m << 1
    _maxflow = 0

    // Resize arrays.
    if (_cur.length < _n) _cur.length = _n
    if (_dist.length < _n) _dist.length = _n
    if (_edges.length < _m) _edges.length = _m
    if (_G.length < _n) _G.length = _n

    _edgeTot = 0
    _Q.init(_n + 1)
    for (let i = 0; i < _n; ++i) _G[i] = []
  }

  function addEdge(from: number, to: number, cap: number): void {
    _G[from].push(_edgeTot)
    // eslint-disable-next-line no-plusplus
    _edges[_edgeTot++] = { from, to, cap, flow: 0 }

    _G[to].push(_edgeTot)
    // eslint-disable-next-line no-plusplus
    _edges[_edgeTot++] = { from: to, to: from, cap: 0, flow: 0 }
  }

  function maxFlow(): number {
    while (bfs()) {
      _cur.fill(0, 0, _n)
      _maxflow += dfs(_source, Number.MAX_SAFE_INTEGER)
    }
    return _maxflow
  }

  function solve(fn: (context: DinicContext) => void): void {
    const context: DinicContext = {
      edgeTot: _edgeTot,
      dist: _dist,
      edges: _edges,
      G: _G,
    }
    fn(context)
  }

  function bfs(): boolean {
    // Initialize the dist array.
    _dist.fill(-1, 0, _n)

    _Q.enqueue(_source)
    _dist[_source] = 0
    while (_Q.size() > 0) {
      const o = _Q.dequeue()!
      for (const i of _G[o]) {
        const e = _edges[i]
        if (_dist[e.to] === -1 && e.cap > e.flow) {
          _dist[e.to] = _dist[o] + 1
          _Q.enqueue(e.to)
        }
      }
    }

    return _dist[_target] !== -1
  }

  function dfs(o: number, minFlow: number): number {
    if (o === _target || minFlow === 0) return minFlow

    let flow = 0
    for (let g = _G[o]; _cur[o] < g.length; ++_cur[o]) {
      const x = g[_cur[o]]
      const e = _edges[x]
      if (_dist[e.to] === _dist[o] + 1) {
        const f = dfs(e.to, Math.min(minFlow, e.cap - e.flow))
        if (f <= 0) continue
        e.flow += f
        _edges[x ^ 1].flow -= f
        flow += f
        // eslint-disable-next-line no-param-reassign
        minFlow -= f
        if (minFlow === 0) break
      }
    }
    return flow
  }
}
