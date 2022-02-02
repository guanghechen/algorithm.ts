import type { ICircularQueue } from '@algorithm.ts/circular-queue'
import { createCircularQueue } from '@algorithm.ts/circular-queue'

/**
 * An arc (or edge) in the residual network.
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
  /**
   * Price of every unit flow.
   */
  cost: number
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

export interface IMcmf {
  /**
   * Initialize the mcmf algorithm.
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
   * @param cost    unit price of flow
   */
  addEdge(from: number, to: number, cap: number, cost: number): void

  /**
   * Calculate the min cost and max flow of the residual network.
   * @returns [minCost, maxFlow]
   */
  minCostMaxFlow(): [number, number]

  /**
   * A hook to support access to mcmf internal variables: it accepts a callback
   * function, and when it is executed, part of the internal variables of mcmf
   * will be passed into the callback function as parameters.
   * @param fn
   */
  solve(fn: (context: IContext) => void): void
}

export interface IOptions {
  /**
   * A big number, representing the unreachable cost.
   */
  INF?: number
}

const DEFAULT_INF = Math.floor(Number.MAX_SAFE_INTEGER / 2)

export function createMcmf(options: IOptions = {}): IMcmf {
  let _source: number // The source point in a network flow
  let _target: number // The sink in a network flow
  let _n: number // The number of nodes in a network flow
  let _mincost: number
  let _maxflow: number
  let _edgeTot: number
  const _INF: number = options.INF ?? DEFAULT_INF
  const _inq: boolean[] = [] // Whether if the i-th node is in the queue.
  const _dist: number[] = [] // The distance from the source node to the i-th node.
  const _path: number[] = [] // An edge in an augmented path.
  const _edges: IEdge[] = []
  const _G: number[][] = []
  const _Q: ICircularQueue<number> = createCircularQueue()
  return { init, addEdge, minCostMaxFlow, solve }

  function init(source: number, target: number, n: number): void {
    _source = source
    _target = target
    _n = n
    _mincost = 0
    _maxflow = 0

    // Resize arrays.
    if (_inq.length < _n) {
      const _start = _inq.length
      _inq.length = _n
      _inq.fill(false, _start, _n)
    }
    if (_dist.length < _n) _dist.length = _n
    if (_path.length < _n) _path.length = _n
    if (_G.length < _n) _G.length = _n

    _edgeTot = 0
    _Q.init(_n + 1)
    for (let i = 0; i < _n; ++i) _G[i] = []
  }

  function addEdge(from: number, to: number, cap: number, cost: number): void {
    _G[from].push(_edgeTot)
    // eslint-disable-next-line no-plusplus
    _edges[_edgeTot++] = { from, to, cap, flow: 0, cost }

    _G[to].push(_edgeTot)
    // eslint-disable-next-line no-plusplus
    _edges[_edgeTot++] = { from: to, to: from, cap: 0, flow: 0, cost: -cost }
  }

  function minCostMaxFlow(): [number, number] {
    while (bellmanFord()) {
      let mif = _INF
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
      _maxflow += mif
      _mincost += mif * _dist[_target]
    }
    return [_mincost, _maxflow]
  }

  function solve(fn: (context: IContext) => void): void {
    const context: IContext = {
      edgeTot: _edgeTot,
      edges: _edges,
      G: _G,
    }
    fn(context)
  }

  /**
   * Negative loops should not appear in the residual network,
   * so there is no need to check if there are negative loops.
   */
  function bellmanFord(): boolean {
    // Initialize the dist array.
    _dist.fill(_INF, 0, _n)

    _Q.enqueue(_source)
    _dist[_source] = 0
    _inq[_source] = true
    while (_Q.size() > 0) {
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

    return _dist[_target] !== _INF
  }
}
