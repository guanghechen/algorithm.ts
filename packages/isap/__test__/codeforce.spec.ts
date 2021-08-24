import fs from 'fs-extra'
import { createReader, loadFixtures, locateFixtures } from 'jest.setup'
import path from 'path'
import { createIsap } from '../src'

describe('codeforces', function () {
  describe('contest 1082', function () {
    test('g', function () {
      const isap = createIsap()
      function solve(content: string): number {
        const io = createReader(content)
        const [n, m] = io.readIntegersOfLine()

        const source = 0
        const target: number = n + m + 1
        isap.init(source, target, n + m + 2)

        const nodes: number[] = io.readIntegersOfLine()
        for (let i = 0; i < n; ++i) {
          const weight: number = nodes[i]
          isap.addEdge(i + 1, target, weight)
        }

        let answer = 0
        for (let i = 1; i <= m; ++i) {
          const [u, v, weight] = io.readIntegersOfLine()
          const x = n + i
          answer += weight
          isap.addEdge(source, x, weight)
          isap.addEdge(x, u, Number.MAX_SAFE_INTEGER)
          isap.addEdge(x, v, Number.MAX_SAFE_INTEGER)
        }
        answer -= isap.maxFlow()
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

      isap.solve(context => expect(Object.keys(context)).toMatchSnapshot())
    })
  })
})
