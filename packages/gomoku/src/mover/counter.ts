import type { GomokuDirectionType } from '../constant'
import { GomokuDirectionTypeBitset, GomokuDirectionTypes } from '../constant'
import type { IGomokuMoverContext } from '../types/mover-context'
import type { IGomokuMoverCounter } from '../types/mover-counter'
import { createHighDimensionArray } from '../util/createHighDimensionArray'

const { rightHalf: halfDirectionTypes } = GomokuDirectionTypes
const { rightHalf: allDirectionTypeBitset } = GomokuDirectionTypeBitset

export class GomokuMoverCounter implements IGomokuMoverCounter {
  public readonly context: Readonly<IGomokuMoverContext>
  protected readonly _mustWinPosSet: Array<Set<number>> // [playerId] => <must-drop position set>
  protected readonly _candidateCouldReachFinal: number[][] // [playerId][posId]

  constructor(context: Readonly<IGomokuMoverContext>) {
    this.context = context
    this._mustWinPosSet = createHighDimensionArray(() => new Set<number>(), context.TOTAL_PLAYER)
    this._candidateCouldReachFinal = createHighDimensionArray(
      () => 0,
      context.TOTAL_PLAYER,
      context.TOTAL_POS,
    )
  }

  public init(): void {
    this._candidateCouldReachFinal.forEach(item => item.fill(0))
    this._mustWinPosSet.forEach(set => set.clear())

    const { context } = this
    const { TOTAL_POS, board } = context
    const [ccrf0, ccrf1] = this._candidateCouldReachFinal
    const [mwps0, mwps1] = this._mustWinPosSet

    // Initialize _candidateCouldReachFinal.
    for (let posId = 0; posId < TOTAL_POS; ++posId) {
      if (board[posId] >= 0) continue

      let flag0 = 0
      let flag1 = 0
      for (const dirType of halfDirectionTypes) {
        const bitFlag: number = 1 << dirType
        if (context.couldReachFinalInDirection(0, posId, dirType)) flag0 |= bitFlag
        if (context.couldReachFinalInDirection(1, posId, dirType)) flag1 |= bitFlag
      }

      ccrf0[posId] = flag0
      ccrf1[posId] = flag1
      if (flag0 > 0) mwps0.add(posId)
      if (flag1 > 0) mwps1.add(posId)
    }
  }

  public forward(posId: number): void {
    // Update _candidateCouldReachFinal.
    this._updateRelatedCouldReachFinal(posId)
  }

  public revert(posId: number): void {
    // Update _dirCountMap.
    this._updateRelatedCouldReachFinal(posId)
  }

  public mustWinPosSet(playerId: number): Iterable<number> & { size: number } {
    return this._mustWinPosSet[playerId]
  }

  public candidateCouldReachFinal(playerId: number, posId: number): boolean {
    return this._candidateCouldReachFinal[playerId][posId] > 0
  }

  protected _updateRelatedCouldReachFinal(centerPosId: number): void {
    const { context } = this
    const { board } = context

    this._updateCouldReachFinal(centerPosId, allDirectionTypeBitset)
    for (const dirType of halfDirectionTypes) {
      const expiredBitset: number = 1 << dirType
      const revDirType: GomokuDirectionType = dirType ^ 1
      const maxMovableSteps0: number = context.maxMovableSteps(centerPosId, revDirType)
      for (let posId = centerPosId, step = 0; step < maxMovableSteps0; ++step) {
        posId = context.fastMoveOneStep(posId, revDirType)
        if (board[posId] < 0) {
          this._updateCouldReachFinal(posId, expiredBitset)
          break
        }
      }

      const maxMovableSteps2: number = context.maxMovableSteps(centerPosId, dirType)
      for (let posId = centerPosId, step = 0; step < maxMovableSteps2; ++step) {
        posId = context.fastMoveOneStep(posId, dirType)
        if (board[posId] < 0) {
          this._updateCouldReachFinal(posId, expiredBitset)
          break
        }
      }
    }
  }

  protected _updateCouldReachFinal(posId: number, expiredBitset: number): void {
    if (expiredBitset > 0) {
      const { context, _mustWinPosSet, _candidateCouldReachFinal } = this
      const prevFlag0 = _candidateCouldReachFinal[0][posId]
      const prevFlag1 = _candidateCouldReachFinal[1][posId]

      _mustWinPosSet[0].delete(posId)
      _mustWinPosSet[1].delete(posId)

      if (context.board[posId] >= 0) {
        _candidateCouldReachFinal[0][posId] = 0
        _candidateCouldReachFinal[1][posId] = 0
        return
      }

      let nextFlag0 = 0
      let nextFlag1 = 0
      for (const dirType of halfDirectionTypes) {
        const bitFlag: number = 1 << dirType
        if (bitFlag & expiredBitset) {
          if (context.couldReachFinalInDirection(0, posId, dirType)) nextFlag0 |= bitFlag
          if (context.couldReachFinalInDirection(1, posId, dirType)) nextFlag1 |= bitFlag
        } else {
          nextFlag0 |= prevFlag0 & bitFlag
          nextFlag1 |= prevFlag1 & bitFlag
        }
      }

      _candidateCouldReachFinal[0][posId] = nextFlag0
      _candidateCouldReachFinal[1][posId] = nextFlag1
      if (nextFlag0 > 0) _mustWinPosSet[0].add(posId)
      if (nextFlag1 > 0) _mustWinPosSet[1].add(posId)
    }
  }
}
