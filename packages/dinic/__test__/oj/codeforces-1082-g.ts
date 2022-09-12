import { Dinic } from '../../src'

export default solveCodeforces1082G

const dinic = new Dinic()
export function solveCodeforces1082G(
  nodes: number[],
  edges: Array<[u: number, v: number, weight: number]>,
): number {
  const n: number = nodes.length
  const m: number = edges.length

  const source = 0
  const target: number = n + m + 1
  dinic.init(source, target, n + m + 2)

  for (let i = 0; i < n; ++i) {
    const weight: number = nodes[i]
    dinic.addEdge(i + 1, target, weight)
  }

  let answer = 0
  for (let i = 0; i < m; ++i) {
    const [u, v, weight] = edges[i]
    const x = n + i
    answer += weight
    dinic.addEdge(source, x, weight)
    dinic.addEdge(x, u, Number.MAX_SAFE_INTEGER)
    dinic.addEdge(x, v, Number.MAX_SAFE_INTEGER)
  }
  answer -= dinic.maxflow()
  return answer
}
