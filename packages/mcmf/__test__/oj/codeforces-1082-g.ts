import { Mcmf } from '../../src'

export default solveCodeforces1082G

const mcmf = new Mcmf()
export function solveCodeforces1082G(
  nodes: number[],
  edges: Array<[u: number, v: number, weight: number]>,
): number {
  const n: number = nodes.length
  const m: number = edges.length

  const source = 0
  const target: number = n + m + 1
  mcmf.init(source, target, n + m + 2)

  for (let i = 0; i < n; ++i) {
    const weight: number = nodes[i]
    mcmf.addEdge(i + 1, target, weight, 0)
  }

  let answer = 0
  for (let i = 0; i < m; ++i) {
    const [u, v, weight] = edges[i]
    const x = n + i
    answer += weight
    mcmf.addEdge(source, x, weight, 0)
    mcmf.addEdge(x, u, Number.MAX_SAFE_INTEGER, 0)
    mcmf.addEdge(x, v, Number.MAX_SAFE_INTEGER, 0)
  }

  const { maxflow } = mcmf.minCostMaxFlow()
  answer -= maxflow
  return answer
}
