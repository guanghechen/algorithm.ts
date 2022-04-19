/**
 *
 * @param N     the number of nodes in the graph.
 * @param edges edges in the graph.
 * @returns An adjacency list. G[i] represent the index list of the edges start from node i.
 */
export const buildEdgeMap = (N: number, edges: Array<{ from: number }>): number[][] => {
  const G: number[][] = new Array(N)
  for (let o = 0; o < N; ++o) G[o] = []
  for (let i = 0; i < edges.length; ++i) {
    const edge = edges[i]
    G[edge.from].push(i)
  }
  return G
}
