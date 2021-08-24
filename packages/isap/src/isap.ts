import type { CircularQueue } from '@algorithm.ts/circular-queue'
import { createCircularQueue } from '@algorithm.ts/circular-queue'
import type { Isap, IsapContext, IsapEdge } from './types'

export function createIsap(): Isap {
  let source: number // The source point in a network flow
  let target: number // The sink in a network flow
  let n: number // The number of nodes in a network flow
  let m: number // The number of edges in a network flow (not including the reverse edges).
  let answer: number
  let edgeTot: number
  const cur: number[] = [] // The next edge number to be considered of the edges starting from the i-th node.
  const cnt: number[] = [] // Counting the points with specified distance.
  const dist: number[] = [] // The distance from the target node to the i-th node.
  const path: number[] = [] // An edge in an augmented path.
  const edges: IsapEdge[] = []
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
    if (cnt.length < n) cnt.length = n
    if (dist.length < n) dist.length = n
    if (path.length < n) path.length = n
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
    bfs()

    // Initialize.
    cur.fill(0, 0, n)
    cnt.fill(0, 0, n)

    for (let o = 0; o < n; ++o) {
      if (dist[o] < n) cnt[dist[o]] += 1
    }

    for (let o = source; dist[o] < n; ) {
      if (o === target) {
        answer += augment()
        o = source
      }

      let blocked = true
      const g = G[o]
      for (let i = cur[o], g = G[o]; i < g.length; ++i) {
        const e = edges[g[i]]
        if (e.cap > e.flow && dist[o] === dist[e.to] + 1) {
          blocked = false
          cur[o] = i
          path[e.to] = g[i]
          o = e.to
          break
        }
      }

      if (blocked) {
        let d = n - 1
        for (const x of g) {
          const e = edges[x]
          if (e.cap > e.flow && d > dist[e.to]) d = dist[e.to]
        }

        // eslint-disable-next-line no-plusplus
        if (--cnt[dist[o]] === 0) break
        cnt[(dist[o] = d + 1)] += 1

        cur[o] = 0
        if (o !== source) o = edges[path[o]].from
      }
    }
    return answer
  }

  function solve(fn: (context: IsapContext) => void): void {
    const context: IsapContext = { edgeTot, cnt, dist, edges, G }
    fn(context)
  }

  function bfs(): void {
    // Initialize the dist array.
    dist.fill(-1, 0, n)

    Q.enqueue(target)
    dist[target] = 0
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
  }

  function augment(): number {
    let mif = Number.MAX_SAFE_INTEGER
    for (let o = target; o !== source; ) {
      const e = edges[path[o]]
      const remainCap = e.cap - e.flow
      if (mif > remainCap) mif = remainCap
      o = e.from
    }
    for (let o = target; o !== source; ) {
      const x = path[o]
      edges[x].flow += mif
      edges[x ^ 1].flow -= mif
      o = edges[x].from
    }
    return mif
  }
}
