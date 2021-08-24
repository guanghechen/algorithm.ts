import fs from 'fs-extra'
import { createReader, loadFixtures, locateFixtures } from 'jest.setup'
import path from 'path'
import { createMcmf } from '../src'

describe('codeforces', function () {
  describe('contest 1082', function () {
    test('g', function () {
      const mcmf = createMcmf()
      function solve(content: string): number {
        const io = createReader(content)
        const [n, m] = io.readIntegersOfLine()

        const source = 0
        const target: number = n + m + 1
        mcmf.init(source, target, n + m + 2, n + m * 3)

        const nodes: number[] = io.readIntegersOfLine()
        for (let i = 0; i < n; ++i) {
          const weight: number = nodes[i]
          mcmf.addEdge(i + 1, target, weight, 1)
        }

        let answer = 0
        for (let i = 1; i <= m; ++i) {
          const [u, v, weight] = io.readIntegersOfLine()
          const x = n + i
          answer += weight
          mcmf.addEdge(source, x, weight, 1)
          mcmf.addEdge(x, u, Number.MAX_SAFE_INTEGER, 1)
          mcmf.addEdge(x, v, Number.MAX_SAFE_INTEGER, 1)
        }

        const [mincost, maxflow] = mcmf.minCostMaxFlow()
        answer -= maxflow
        return answer
      }

      const caseDir: string = locateFixtures('codeforces/1082/g')
      const filenames: string[] = fs.readdirSync(caseDir).sort()
      for (const filename of filenames) {
        if (filename.endsWith('.in')) {
          const inputFilepath = path.join(caseDir, filename)
          const content = loadFixtures(inputFilepath)
          const output: number = solve(content)

          const answerFilepath = inputFilepath.replace(/\.in$/, '.out')
          const answer = Number(loadFixtures(answerFilepath))
          // eslint-disable-next-line jest/no-conditional-expect
          expect(output).toEqual(answer)
        }
      }

      mcmf.solve(context => expect(Object.keys(context)).toMatchSnapshot())
    })
  })

  describe('contest 277', function () {
    test('e', function () {
      const mcmf = createMcmf()

      const caseDir: string = locateFixtures('codeforces/0277/e')
      const filenames: string[] = fs.readdirSync(caseDir).sort()
      for (const filename of filenames) {
        if (filename.endsWith('.in')) {
          const inputFilepath = path.join(caseDir, filename)
          const content = loadFixtures(inputFilepath)
          const output: number = solve(content)
          const answerFilepath = inputFilepath.replace(/\.in$/, '.out')
          const answer = Number(loadFixtures(answerFilepath))
          // eslint-disable-next-line jest/no-conditional-expect
          expect(Math.abs(output - answer)).toBeLessThanOrEqual(1e-6)
        }
      }
      mcmf.solve(context => expect(Object.keys(context)).toMatchSnapshot())

      function solve(content: string): number {
        const io = createReader(content)

        const [N] = io.readIntegersOfLine()

        const vertexes: Vertex[] = new Array(N)
        for (let i = 0; i < N; ++i) {
          const [x, y] = io.readIntegersOfLine()
          vertexes[i] = { x, y }
        }
        vertexes.sort((p, q) => {
          if (p.y === q.y) return p.x - q.x
          return q.y - p.y
        })

        const source = 0
        const target: number = N * 2 + 1
        mcmf.init(source, target, N * 2 + 2, N * N + 2 * N)

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

      function dist(p: Vertex, q: Vertex): number {
        const d = (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y)
        return Math.sqrt(d)
      }

      interface Vertex {
        x: number
        y: number
      }
    })
  })
})
