import { GomokuContext, GomokuStateCompressor } from '../src'

type IStep = [r: number, c: number]

class TesterHelper {
  public readonly context: GomokuContext
  public readonly compressor: GomokuStateCompressor

  constructor(MAX_ROW: number, MAX_COL: number, MAX_ADJACENT: number) {
    const context = new GomokuContext({
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT,
      MAX_DISTANCE_OF_NEIGHBOR: 2,
    })
    const compressor = new GomokuStateCompressor(BigInt(context.TOTAL_POS))
    this.context = context
    this.compressor = compressor
  }

  public createState(steps: IStep[]): bigint {
    const { context, compressor } = this

    const lftIds: number[] = []
    const rhtIds: number[] = []
    for (let i = 0; i < steps.length; ++i) {
      const [r, c] = steps[i]
      const id: number = context.idx(r, c)
      if (i & 1) rhtIds.push(id)
      else lftIds.push(id)
    }

    lftIds.sort((x, y) => x - y)
    rhtIds.sort((x, y) => x - y)

    let state = 1n
    for (const id of lftIds) state = (state << compressor.MOVE_STEP_BIT_BASE) | BigInt(id)
    for (const id of rhtIds) state = (state << compressor.MOVE_STEP_BIT_BASE) | BigInt(id)
    return state
  }

  public decompressState(state: bigint): IStep[] {
    const { context, compressor } = this
    const steps: IStep[] = []
    for (let v = state; v > 1n; v >>= compressor.MOVE_STEP_BIT_BASE) {
      const id: bigint = v & compressor.MOVE_STEP_MASK
      const [r, c] = context.revIdx(Number(id))
      steps.push([r, c])
    }
    return steps
  }
}

describe('15x15', function () {
  const helper = new TesterHelper(15, 15, 5)

  test('basic', function () {
    const steps: IStep[] = [
      [2, 3],
      [2, 4],
      [3, 6],
      [1, 5],
      [3, 7],
      [4, 8],
    ]

    for (let i = 0; i <= steps.length; ++i) {
      const steps1: IStep[] = steps.slice(0, i)
      const state1 = helper.createState(steps1)

      const pSteps1: IStep[] = helper.decompressState(state1)
      expect(pSteps1.length).toEqual(steps1.length)
      expect(pSteps1).toEqual(expect.arrayContaining(steps1))
      expect(steps1).toEqual(expect.arrayContaining(pSteps1))

      const newStep: IStep = [3, 3]
      const newStepId: number = helper.context.idx(...newStep)
      const steps2: IStep[] = [...steps1, newStep]
      const state2: bigint = helper.compressor.compress(steps1.length, state1, BigInt(newStepId))
      expect(state2).toEqual(helper.createState(steps2))
    }
  })
})
