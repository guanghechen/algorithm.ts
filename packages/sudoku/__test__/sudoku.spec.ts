import type { SudokuBoard } from '../src'
import { SudokuCreator, SudokuSolver, checkSudokuSolution } from '../src'
import { createSudokuBoard } from '../src/util'
import multipleSudoku9x9 from './fixtures/sudoku9x9/multiple.json'
import uniqueSudoku9x9 from './fixtures/sudoku9x9/unique.json'

describe('9x9', function () {
  const SUDOKU_SIZE_SQRT = 3
  const SUDOKU_SIZE = 9

  const solver = new SudokuSolver({ childMatrixSize: SUDOKU_SIZE_SQRT })
  const creator = new SudokuCreator({ childMatrixSize: SUDOKU_SIZE_SQRT })

  test('unique solution', function () {
    const solution: SudokuBoard = createSudokuBoard(SUDOKU_SIZE)
    for (const { puzzle, solution: answer } of uniqueSudoku9x9) {
      expect(solver.solve(puzzle, solution)).toBe(true)
      expect(checkSudokuSolution(solution, SUDOKU_SIZE_SQRT)).toBe(true)
      expect(solution).toEqual(answer)
    }
  })

  test('multiple solution', function () {
    const solution: SudokuBoard = createSudokuBoard(SUDOKU_SIZE)
    for (const { puzzle } of multipleSudoku9x9) {
      expect(solver.solve(puzzle, solution)).toBe(true)
      expect(checkSudokuSolution(solution, SUDOKU_SIZE_SQRT)).toBe(true)
    }
  })

  test('create puzzle', function () {
    const solution: SudokuBoard = createSudokuBoard(SUDOKU_SIZE)
    for (let difficulty = 0; difficulty <= 1; difficulty += 0.1) {
      const { puzzle, solution: answer } = creator.createSudoku(difficulty)
      expect(solver.solve(puzzle, solution)).toBe(true)

      for (let r = 0; r < SUDOKU_SIZE; ++r) {
        for (let c = 0; c < SUDOKU_SIZE; ++c) {
          const v = puzzle[r][c]
          if (v === -1) continue
          expect(answer[r][c]).toEqual(v)
          expect(solution[r][c]).toEqual(v)
        }
      }

      expect(checkSudokuSolution(answer, SUDOKU_SIZE_SQRT)).toBe(true)
      expect(checkSudokuSolution(solution, SUDOKU_SIZE_SQRT)).toBe(true)
      expect(solution).toEqual(answer)
    }
  })
})

describe('16x16', function () {
  const SUDOKU_SIZE_SQRT = 4
  const SUDOKU_SIZE = 16

  const solver = new SudokuSolver({ childMatrixSize: SUDOKU_SIZE_SQRT })
  const creator = new SudokuCreator({ childMatrixSize: SUDOKU_SIZE_SQRT })

  test('create puzzle', function () {
    const solution: SudokuBoard = createSudokuBoard(SUDOKU_SIZE)
    for (let difficulty = 0; difficulty <= 0.4; difficulty += 0.1) {
      const { puzzle, solution: answer } = creator.createSudoku(difficulty)
      expect(solver.solve(puzzle, solution)).toBe(true)

      for (let r = 0; r < SUDOKU_SIZE; ++r) {
        for (let c = 0; c < SUDOKU_SIZE; ++c) {
          const v = puzzle[r][c]
          if (v === -1) continue
          expect(answer[r][c]).toEqual(v)
          expect(solution[r][c]).toEqual(v)
        }
      }

      expect(checkSudokuSolution(answer, SUDOKU_SIZE_SQRT)).toBe(true)
      expect(checkSudokuSolution(solution, SUDOKU_SIZE_SQRT)).toBe(true)
      expect(solution).toEqual(answer)
    }
  })
})
