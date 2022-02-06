import { createEnhancedFindset } from '../../src'
import type { IEnhancedFindset } from '../../src'

export default findAllPeople

const MAX_N = 1e5 + 10

const answer: Set<number> = new Set()
const nodes: Set<number> = new Set()
const visited: Uint8Array = new Uint8Array(MAX_N)
const findset: IEnhancedFindset = createEnhancedFindset(MAX_N)

export function findAllPeople(N: number, meetings: number[][], firstPerson: number): number[] {
  const M: number = meetings.length

  answer.clear()
  answer.add(1)
  answer.add(firstPerson + 1)

  meetings
    .sort((x, y) => x[2] - y[2])
    .forEach(item => {
      item[0] += 1
      item[1] += 1
    })

  for (let i = 0, j: number; i < M; i = j) {
    const t: number = meetings[i][2]
    for (j = i + 1; j < M; ++j) {
      if (meetings[j][2] !== t) break
    }

    nodes.clear()
    for (let k = i; k < j; ++k) {
      const [x, y] = meetings[k]
      nodes.add(x)
      nodes.add(y)
    }

    for (const x of nodes) {
      findset.initNode(x)
      visited[x] = 0
    }

    for (let k = i; k < j; ++k) {
      const [x, y] = meetings[k]
      findset.merge(x, y)
    }

    for (const x of nodes) {
      if (!answer.has(x)) continue

      const xx: number = findset.root(x)
      if (visited[xx]) continue
      visited[xx] = 1

      const xxSet: Set<number> = findset.getSetOf(xx)!
      for (const t of xxSet) answer.add(t)
    }
  }

  return Array.from(answer)
    .map(x => x - 1)
    .sort((x, y) => x - y)
}
