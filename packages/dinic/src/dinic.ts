import type { CircularQueue } from '@algorithm.ts/circular-queue'
import { createCircularQueue } from '@algorithm.ts/circular-queue'
import type { Dinic, DinicContext, DinicEdge } from './types'

export function createDinic(): Dinic {
  let source: number // The source point in a network flow
  let target: number // The sink in a network flow
  let n: number // The number of nodes in a network flow
  let m: number // The number of edges in a network flow (not including the reverse edges).
  let answer: number
  let edgeTot: number
  const cur: number[] = [] // The next edge number to be considered of the edges starting from the i-th node.
  const dist: number[] = [] // The distance from the source node to the i-th node.
  const edges: DinicEdge[] = []
  const G: number[][] = []
  const Q: CircularQueue<number> = createCircularQueue()
  return { init, addEdge, maxflow, solve }

  function init(
    _source: number,
    _target: number,
    _n: number,
    _m: number,
  ): void {
    source = _source
    target = _target
    n = _n
    m = m << 1
    answer = 0

    // Resize arrays.
    if (cur.length < n) cur.length = n
    if (dist.length < n) dist.length = n
    if (edges.length < m) edges.length = m
    if (G.length < n) G.length = n

    edgeTot = 0
    Q.init(n + 1)
    for (let i = 0; i < n; ++i) G[i] = []
  }

  function addEdge(from: number, to: number, cap: number): void {
    G[from].push(edgeTot)
    // eslint-disable-next-line no-plusplus
    edges[edgeTot++] = { from, to, cap, flow: 0 }

    G[to].push(edgeTot)
    // eslint-disable-next-line no-plusplus
    edges[edgeTot++] = { from: to, to: from, cap: 0, flow: 0 }
  }

  function maxflow(): number {
    while (bfs()) {
      cur.fill(0, 0, n)
      answer += dfs(source, Number.MAX_SAFE_INTEGER)
    }
    return answer
  }

  function solve(fn: (context: DinicContext) => void): void {
    const context: DinicContext = { edgeTot, dist, edges, G }
    fn(context)
  }

  function bfs(): boolean {
    // Initialize the dist array.
    dist.fill(-1, 0, n)

    Q.enqueue(source)
    dist[source] = 0
    while (Q.size() > 0) {
      const o = Q.dequeue()!
      for (const i of G[o]) {
        const e = edges[i]
        if (dist[e.to] === -1 && e.cap > e.flow) {
          dist[e.to] = dist[o] + 1
          Q.enqueue(e.to)
        }
      }
    }

    return dist[target] !== -1
  }

  function dfs(o: number, minFlow: number): number {
    if (o === target || minFlow === 0) return minFlow

    let flow = 0
    for (let g = G[o]; cur[o] < g.length; ++cur[o]) {
      const x = g[cur[o]]
      const e = edges[x]
      if (dist[e.to] === dist[o] + 1) {
        const f = dfs(e.to, Math.min(minFlow, e.cap - e.flow))
        if (f <= 0) continue
        e.flow += f
        edges[x ^ 1].flow -= f
        flow += f
        // eslint-disable-next-line no-param-reassign
        minFlow -= f
        if (minFlow === 0) break
      }
    }
    return flow
  }
}
