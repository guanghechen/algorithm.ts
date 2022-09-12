import { Mcmf } from '../../src'

export default maxStudents

const mcmf = new Mcmf()
export function maxStudents(seats: string[][]): number {
  const R: number = seats.length
  if (R <= 0) return 0

  const C: number = seats[0].length
  if (C <= 0) return 0

  let total = 0
  const seatCodes: number[][] = new Array(R)
  for (let r = 0; r < R; ++r) seatCodes[r] = new Array(C).fill(-1)

  for (let r = 0; r < R; ++r) {
    for (let c = 0; c < C; ++c) {
      if (seats[r][c] === '.') seatCodes[r][c] = total++
    }
  }

  if (total <= 0) return 0
  if (total === 1) return 1

  const source: number = total * 2
  const target: number = source + 1
  mcmf.init(source, target, target + 1)

  for (let r = 0; r < R; ++r) {
    for (let c = 0; c < C; ++c) {
      const u: number = seatCodes[r][c]
      if (u > -1) {
        mcmf.addEdge(source, u, 1, 0)
        mcmf.addEdge(u + total, target, 1, 0)
        if (r > 0) {
          // Check upper left
          if (c > 0 && seatCodes[r - 1][c - 1] > -1) {
            const v: number = seatCodes[r - 1][c - 1]
            mcmf.addEdge(u, v + total, 1, 0)
            mcmf.addEdge(v, u + total, 1, 0)
          }

          // Check upper right
          if (c + 1 < C && seatCodes[r - 1][c + 1] > -1) {
            const v: number = seatCodes[r - 1][c + 1]
            mcmf.addEdge(u, v + total, 1, 0)
            mcmf.addEdge(v, u + total, 1, 0)
          }
        }

        // Check left
        if (c > 0 && seatCodes[r][c - 1] > -1) {
          const v: number = seatCodes[r][c - 1]
          mcmf.addEdge(u, v + total, 1, 0)
          mcmf.addEdge(v, u + total, 1, 0)
        }
      }
    }
  }

  const { maxflow } = mcmf.minCostMaxFlow()
  const totalPaired: number = maxflow / 2
  return total - totalPaired
}
