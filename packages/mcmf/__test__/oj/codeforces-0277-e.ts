import { createMcmf } from '../../src'

export default solveCodeforces0277E

const mcmf = createMcmf()
export function solveCodeforces0277E(coordinates: Array<[x: number, y: number]>): number {
  const N: number = coordinates.length

  const vertexes: IVertex[] = coordinates
    .map(([x, y]) => ({ x, y }))
    .sort((p, q) => {
      if (p.y === q.y) return p.x - q.x
      return q.y - p.y
    })

  const source = 0
  const target: number = N * 2 + 1
  mcmf.init(source, target, N * 2 + 2)

  for (let i = 0; i < N; ++i) {
    mcmf.addEdge(source, i + 1, 2, 0)
    mcmf.addEdge(N + i + 1, target, 1, 0)
    for (let j = i + 1; j < N; ++j) {
      if (vertexes[i].y === vertexes[j].y) continue
      mcmf.addEdge(i + 1, N + j + 1, 1, dist(vertexes[i], vertexes[j]))
    }
  }

  const [mincost, maxflow] = mcmf.minCostMaxFlow()
  const answer = maxflow === N - 1 ? mincost : -1
  return answer
}

function dist(p: IVertex, q: IVertex): number {
  const d = (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y)
  return Math.sqrt(d)
}

interface IVertex {
  x: number
  y: number
}
