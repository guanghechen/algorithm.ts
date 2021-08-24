import fs from 'fs-extra'
import { createReader, loadFixtures, locateFixtures } from 'jest.setup'
import path from 'path'
import { createDinic } from '../src'

describe('codeforces', function () {
  describe('contest 1082', function () {
    test('g', function () {
      const dinic = createDinic()
      function solve(content: string): number {
        const io = createReader(content)
        const [n, m] = io.readIntegersOfLine()

        const source = 0
        const target: number = n + m + 1
        dinic.init(source, target, n + m + 2)

        const nodes: number[] = io.readIntegersOfLine()
        for (let i = 0; i < n; ++i) {
          const weight: number = nodes[i]
          dinic.addEdge(i + 1, target, weight)
        }

        let answer = 0
        for (let i = 1; i <= m; ++i) {
          const [u, v, weight] = io.readIntegersOfLine()
          const x = n + i
          answer += weight
          dinic.addEdge(source, x, weight)
          dinic.addEdge(x, u, Number.MAX_SAFE_INTEGER)
          dinic.addEdge(x, v, Number.MAX_SAFE_INTEGER)
        }
        answer -= dinic.maxFlow()
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

      dinic.solve(context => expect(Object.keys(context)).toMatchSnapshot())
    })
  })
})
