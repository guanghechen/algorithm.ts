import type { ICircularQueue } from '@algorithm.ts/circular-queue'
import { createCircularQueue } from '@algorithm.ts/circular-queue'

/**
 * An arc in the residual network.
 */
export interface IEdge {
  /**
   * The starting node of the arc.
   */
  from: number
  /**
   * The ending node of the arc.
   */
  to: number
  /**
   * Capacity of the arc.
   */
  cap: number
  /**
   * Flow on the arc.
   */
  flow: number
}

export interface IContext {
  /**
   * The number of valid edges.
   *
   * In order to save space, there is not recreate a new array at each `init()` called, so this
   * field is used to record the actual effective array length.
   */
  edgeTot: number
  /**
   * Graph edges.
   */
  edges: ReadonlyArray<IEdge>
  /**
   * Adjacency list. G[i] represent the index list of the  edges start from node i.
   */
  G: ReadonlyArray<ReadonlyArray<number>>
}

export interface IDinic {
  /**
   * Initialize the dinic algorithm.
   * @param source  the source node
   * @param target  the target node
   * @param n       the number of nodes
   */
  init(source: number, target: number, n: number): void

  /**
   * Add an edge into the residual network.
   * @param from    the starting node
   * @param to      the ending node
   * @param cap     capacity
   */
  addEdge(from: number, to: number, cap: number): void

  /**
   * Calculate the max flow of the residual network.
   */
  maxFlow(): number

  /**
   * A hook to support access to dinic internal variables: it accepts a callback
   * function, and when it is executed, part of the internal variables of dinic
   * will be passed into the callback function as parameters.
   * @param fn
   */
  solve(fn: (context: IContext) => void): void
}

export function createDinic(): IDinic {
  let _source: number // The source point in a network flow
  let _target: number // The sink in a network flow
  let _n: number // The number of nodes in a network flow
  let _maxflow: number
  let _edgeTot: number
  const _cur: number[] = [] // The next edge number to be considered of the edges starting from the i-th node.
  const _dist: number[] = [] // The distance from the source node to the i-th node.
  const _edges: IEdge[] = []
  const _G: number[][] = []
  const _Q: ICircularQueue<number> = createCircularQueue()
  return { init, addEdge, maxFlow, solve }

  function init(source: number, target: number, n: number): void {
    _source = source
    _target = target
    _n = n
    _maxflow = 0

    // Resize arrays.
    if (_cur.length < _n) _cur.length = _n
    if (_dist.length < _n) _dist.length = _n
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

  function solve(fn: (context: IContext) => void): void {
    const context: IContext = {
      edgeTot: _edgeTot,
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
