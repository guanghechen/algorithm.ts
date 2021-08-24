import type { CircularQueue } from '@algorithm.ts/circular-queue'
import { createCircularQueue } from '@algorithm.ts/circular-queue'
import type { Isap, IsapContext, IsapEdge } from './types'

export function createIsap(): Isap {
  let _source: number // The source point in a network flow
  let _target: number // The sink in a network flow
  let _n: number // The number of nodes in a network flow
  let _answer: number
  let _edgeTot: number
  const _cur: number[] = [] // The next edge number to be considered of the edges starting from the i-th node.
  const _cnt: number[] = [] // Counting the points with specified distance.
  const _dist: number[] = [] // The distance from the target node to the i-th node.
  const _path: number[] = [] // An edge in an augmented path.
  const _edges: IsapEdge[] = []
  const _G: number[][] = []
  const _Q: CircularQueue<number> = createCircularQueue()
  return { init, addEdge, maxFlow, solve }

  function init(source: number, target: number, n: number): void {
    _source = source
    _target = target
    _n = n
    _answer = 0

    // Resize arrays.
    if (_cur.length < _n) _cur.length = _n
    if (_cnt.length < _n) _cnt.length = _n
    if (_dist.length < _n) _dist.length = _n
    if (_path.length < _n) _path.length = _n
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
    bfs()

    // Initialize.
    _cur.fill(0, 0, _n)
    _cnt.fill(0, 0, _n)

    for (let o = 0; o < _n; ++o) {
      if (_dist[o] < _n) _cnt[_dist[o]] += 1
    }

    for (let o = _source; _dist[o] < _n; ) {
      if (o === _target) {
        _answer += augment()
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
        let d = _n - 1
        for (const x of g) {
          const e = _edges[x]
          if (e.cap > e.flow && d > _dist[e.to]) d = _dist[e.to]
        }

        // eslint-disable-next-line no-plusplus
        if (--_cnt[_dist[o]] === 0) break
        _cnt[(_dist[o] = d + 1)] += 1

        _cur[o] = 0
        if (o !== _source) o = _edges[_path[o]].from
      }
    }
    return _answer
  }

  function solve(fn: (context: IsapContext) => void): void {
    const context: IsapContext = {
      edgeTot: _edgeTot,
      cnt: _cnt,
      dist: _dist,
      edges: _edges,
      G: _G,
    }
    fn(context)
  }

  function bfs(): void {
    // Initialize the dist array.
    _dist.fill(-1, 0, _n)

    _Q.enqueue(_target)
    _dist[_target] = 0
    while (_Q.size() > 0) {
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

  function augment(): number {
    let mif = Number.MAX_SAFE_INTEGER
    for (let o = _target; o !== _source; ) {
      const e = _edges[_path[o]]
      const remainCap = e.cap - e.flow
      if (mif > remainCap) mif = remainCap
      o = e.from
    }
    for (let o = _target; o !== _source; ) {
      const x = _path[o]
      _edges[x].flow += mif
      _edges[x ^ 1].flow -= mif
      o = _edges[x].from
    }
    return mif
  }
}
