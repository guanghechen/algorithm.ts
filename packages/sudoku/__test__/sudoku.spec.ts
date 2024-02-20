import type { ISudokuBoardData } from '../src'
import {
  SudokuCreator,
  SudokuSize,
  SudokuSolver,
  createSudokuBoardData,
  verifySolution,
} from '../src'
import multipleSudoku9x9 from './fixtures/sudoku9x9/multiple.json'
import uniqueSudoku9x9 from './fixtures/sudoku9x9/unique.json'

describe('SudokuSize', () => {
  it('basic', function () {
    for (let base = 1; base <= 9; base++) {
      const size = new SudokuSize(base)
      expect(size.BASE_1).toEqual(base ** 1)
      expect(size.BASE_2).toEqual(base ** 2)
      expect(size.BASE_3).toEqual(base ** 3)
      expect(size.BASE_4).toEqual(base ** 4)
      expect(size.MATRIX_RANK).toEqual(base ** 1)
      expect(size.MATRIX).toEqual(base ** 2)
      expect(size.BOARD).toEqual(base ** 4)
    }
  })
})

describe('9x9', function () {
  const size = new SudokuSize(3)
  const solver = new SudokuSolver({ childMatrixWidth: size.MATRIX_RANK })
  const creator = new SudokuCreator({ childMatrixWidth: size.MATRIX_RANK })

  it('unique solution', function () {
    for (const kase of uniqueSudoku9x9) {
      const puzzle: Readonly<ISudokuBoardData> = kase.puzzle.flat()
      const answer: Readonly<ISudokuBoardData> = kase.solution.flat()
      const solution = createSudokuBoardData(size)
      expect(solver.solve(puzzle, solution)).toEqual(true)
      expect(verifySolution(solution, size)).toEqual(true)
      expect(solution).toEqual(answer)
    }
  })

  it('multiple solution', function () {
    for (const kase of multipleSudoku9x9) {
      const puzzle: Readonly<ISudokuBoardData> = kase.puzzle.flat()
      const solution: ISudokuBoardData = createSudokuBoardData(size)
      expect(solver.solve(puzzle, solution)).toEqual(true)
      expect(verifySolution(solution, size)).toEqual(true)
    }
  })

  it('create puzzle', function () {
    for (let difficulty = 0; difficulty <= 1; difficulty += 0.1) {
      const { puzzle, solution: answer } = creator.createSudoku(difficulty)
      const solution: ISudokuBoardData = createSudokuBoardData(size)
      expect(solver.solve(puzzle, solution)).toEqual(true)

      for (let p = 0; p < size.BOARD; ++p) {
        const v = puzzle[p]
        if (v === -1) continue
        expect(answer[p]).toEqual(v)
        expect(solution[p]).toEqual(v)
      }

      expect(verifySolution(answer, size)).toEqual(true)
      expect(verifySolution(solution, size)).toEqual(true)
      expect(solution).toEqual(answer)
    }
  })
})

describe('16x16', function () {
  const size = new SudokuSize(4)
  const solver = new SudokuSolver({ childMatrixWidth: size.MATRIX_RANK })
  const creator = new SudokuCreator({ childMatrixWidth: size.MATRIX_RANK })

  it('create puzzle', function () {
    for (let difficulty = 0; difficulty <= 0.4; difficulty += 0.1) {
      const { puzzle, solution: answer } = creator.createSudoku(difficulty)
      const solution: ISudokuBoardData = createSudokuBoardData(size)
      expect(solver.solve(puzzle, solution)).toEqual(true)

      for (let p = 0; p < size.BOARD; ++p) {
        const v = puzzle[p]
        if (v === -1) continue
        expect(answer[p]).toEqual(v)
        expect(solution[p]).toEqual(v)
      }

      expect(verifySolution(answer, size)).toEqual(true)
      expect(verifySolution(solution, size)).toEqual(true)
      expect(solution).toEqual(answer)
    }
  })
})
