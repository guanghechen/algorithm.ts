import type { IGomokuMoverContext, IGomokuSolutionProps } from '../src'
import { GomokuSolution } from '../src'

class Solution extends GomokuSolution {
  public readonly moverContext: Readonly<IGomokuMoverContext>

  public constructor(props: IGomokuSolutionProps) {
    super(props)
    this.moverContext = this._moverContext
  }
}

describe('construction', () => {
  it('default', () => {
    const solution = new Solution({ MAX_ROW: 15, MAX_COL: 15 })
    expect(solution.moverContext.MAX_ROW).toEqual(15)
    expect(solution.moverContext.MAX_COL).toEqual(15)
    expect(solution.moverContext.MAX_ADJACENT).toEqual(5)
    expect(solution.moverContext.TOTAL_POS).toEqual(15 * 15)
    expect(solution.moverContext.MAX_DISTANCE_OF_NEIGHBOR).toEqual(2)
  })
})

describe('board geometry', () => {
  it.each([
    { rows: 5, columns: 6, center: [2, 3] },
    { rows: 6, columns: 5, center: [3, 2] },
    { rows: 6, columns: 6, center: [3, 3] },
  ])('opens at the center of an empty $rows × $columns board', ({ rows, columns, center }) => {
    const solution = new GomokuSolution({ MAX_ROW: rows, MAX_COL: columns })
    solution.init([])
    expect(solution.minimaxSearch(0)).toEqual(center)
  })

  it.each([
    { rows: 5, columns: 6, rowStep: 0, columnStep: 1 },
    { rows: 6, columns: 5, rowStep: 1, columnStep: 0 },
  ])('finds, plays and undoes the winning corner on a $rows × $columns board', board => {
    const { rows, columns, rowStep, columnStep } = board
    const solution = new GomokuSolution({ MAX_ROW: rows, MAX_COL: columns })
    const lastRow = rows - 1
    const lastColumn = columns - 1
    const pieces = Array.from({ length: 4 }, (_, index) => ({
      r: lastRow - (index + 1) * rowStep,
      c: lastColumn - (index + 1) * columnStep,
      p: 0,
    }))
    pieces.push({ r: lastRow - 5 * rowStep, c: lastColumn - 5 * columnStep, p: 1 })
    solution.init(pieces)

    expect(solution.minimaxSearch(0)).toEqual([lastRow, lastColumn])
    solution.forward(lastRow, lastColumn, 0)
    expect(solution.mover.isFinal()).toBe(true)
    solution.revert(lastRow, lastColumn)
    expect(solution.mover.isFinal()).toBe(false)
    expect(solution.minimaxSearch(0)).toEqual([lastRow, lastColumn])
  })
})

describe('15x15', () => {
  class Solution15x15 extends Solution {
    public constructor() {
      super({
        MAX_ROW: 15,
        MAX_COL: 15,
        MAX_ADJACENT: 5,
        MAX_DISTANCE_OF_NEIGHBOR: 2,
      })
    }
  }

  const getSolution = (): Solution15x15 => new Solution15x15()

  it('basic', async () => {
    const solution = getSolution()
    solution.init([])
    solution.forward(7, 7, 0)
    let [r, c] = solution.minimaxSearch(1)
    expect(Math.abs(r - 7)).toBeLessThanOrEqual(2)
    expect(Math.abs(c - 7)).toBeLessThanOrEqual(2)

    solution.forward(6, 6, 1)
    ;[r, c] = solution.minimaxSearch(0)
    expect(Math.abs(r - 7)).toBeLessThanOrEqual(3)
    expect(Math.abs(c - 7)).toBeLessThanOrEqual(3)

    solution.forward(6, 7, 0)
    ;[r, c] = solution.minimaxSearch(1)
    expect(Math.abs(r - 7)).toBeLessThanOrEqual(3)
    expect(Math.abs(c - 7)).toBeLessThanOrEqual(3)
  })

  it('pieces.0', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.0.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)

    const [r0, c0] = solution.minimaxSearch(0)
    expect([
      [4, 7],
      [8, 7],
    ]).toContainEqual([r0, c0])

    solution.init(pieces)
    const [r1, c1] = solution.minimaxSearch(1)
    expect([
      [4, 7],
      [8, 7],
    ]).toContainEqual([r1, c1])
  })

  it('pieces.3', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.3.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)

    const [r0, c0] = solution.minimaxSearch(0)
    expect([[8, 3]]).toContainEqual([r0, c0])

    solution.init(pieces)
    const [r1, c1] = solution.minimaxSearch(1)
    expect([
      [4, 4],
      [9, 4],
    ]).toContainEqual([r1, c1])
  })

  it('pieces.4', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.4.json', {
      with: { type: 'json' },
    })
    solution.init([])
    for (const { r, c, p } of pieces) solution.forward(r, c, p)
    expect(solution.mover.isFinal()).toEqual(true)
    const [r, c] = solution.minimaxSearch(1)
    expect([[-1, -1]]).toContainEqual([r, c])
  })

  it('pieces.5', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.5.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)
    const [r, c] = solution.minimaxSearch(1)
    expect([
      [5, 10],
      [6, 6],
      [7, 7],
    ]).toContainEqual([r, c])
  })

  it('pieces.8', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.8.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)

    const [r0, c0] = solution.minimaxSearch(0)
    expect([
      [11, 4],
      [12, 3],
      [12, 10],
      [11, 11],
      [12, 11],
    ]).toContainEqual([r0, c0])

    const [r1, c1] = solution.minimaxSearch(1)
    expect([
      [7, 10],
      [7, 12],
      [12, 11],
    ]).toContainEqual([r1, c1])
  })

  it('pieces.9', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.9.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)

    const [r0, c0] = solution.minimaxSearch(0)
    expect([
      [7, 6],
      [7, 11],
    ]).toContainEqual([r0, c0])

    const [r1, c1] = solution.minimaxSearch(1)
    expect([
      [6, 6],
      [6, 10],
      [7, 6],
      [7, 11],
    ]).toContainEqual([r1, c1])
  })

  it('pieces.10', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.10.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)
    const [r, c] = solution.minimaxSearch(1)
    expect([r, c]).toEqual([7, 10])
  })

  it('pieces.11', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.11.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)
    const [r, c] = solution.minimaxSearch(0)
    expect([
      [8, 2],
      [8, 4],
    ]).toContainEqual([r, c])

    const [r1, c1] = solution.minimaxSearch(1)
    expect([r1, c1]).toEqual([8, 2])
  })

  it('pieces.12', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.12.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)
    const [r, c] = solution.minimaxSearch(0)
    expect([
      [9, 4],
      [9, 8],
      [10, 4],
      [11, 3],
    ]).toContainEqual([r, c])
  })

  it('pieces.13', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.13.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)
    const [r, c] = solution.minimaxSearch(0)
    expect([
      [10, 4],
      [10, 5],
      [11, 3],
      [11, 6],
      [6, 9],
    ]).toContainEqual([r, c])
  })

  it('pieces.15', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.15.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)
    const [r, c] = solution.minimaxSearch(0)
    expect([
      [5, 2],
      [5, 6],
      [12, 4],
    ]).toContainEqual([r, c])
  })

  it('pieces.16', async () => {
    const solution = getSolution()
    const { default: pieces } = await import('./fixtures/15x15/pieces.16.json', {
      with: { type: 'json' },
    })
    solution.init(pieces)
    const [r, c] = solution.minimaxSearch(0)
    expect([
      [4, 4],
      [8, 8],
    ]).toContainEqual([r, c])
  })

  it('edge case', () => {
    const solution = getSolution()
    solution.init([])
    const [r, c] = solution.minimaxSearch(0)
    expect([r, c]).toEqual([7, 7])
  })
})

describe('5x5', () => {
  class Solution5x5 extends Solution {
    public constructor(MAX_ADJACENT?: number) {
      super({
        MAX_ROW: 5,
        MAX_COL: 5,
        MAX_ADJACENT,
        MAX_DISTANCE_OF_NEIGHBOR: 2,
      })
    }
  }

  it('edge case', () => {
    const solution = new Solution5x5(100)
    solution.init([])

    let player = 0
    for (let r = 0; r < solution.moverContext.MAX_ROW; ++r) {
      for (let c = 0; c < solution.moverContext.MAX_COL; ++c) {
        solution.forward(r, c, player)
        player ^= 1
      }
    }
    expect(solution.minimaxSearch(1)).toEqual([-1, -1])

    solution.revert(0, 1)
    expect(solution.minimaxSearch(1)).toEqual([0, 1])
  })
})
