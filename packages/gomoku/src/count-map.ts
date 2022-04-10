import type { GomokuDirectionType } from './constant'
import { GomokuDirectionTypeBitset, GomokuDirectionTypes } from './constant'
import type { IGomokuContext } from './context.type'
import type { IGomokuCountMap } from './count-map.type'
import { createHighDimensionArray } from './util/createHighDimensionArray'

const { rightHalf: halfDirectionTypes } = GomokuDirectionTypes
const { rightHalf: allDirectionTypeBitset } = GomokuDirectionTypeBitset

export class GomokuCountMap implements IGomokuCountMap {
  public readonly context: Readonly<IGomokuContext>
  protected readonly _mustDropPosSet: Array<Set<number>> // [playerId] => <must-drop position set>
  protected readonly _candidateCouldReachFinal: number[][] // [playerId][posId]

  constructor(context: Readonly<IGomokuContext>) {
    this.context = context
    this._mustDropPosSet = createHighDimensionArray(() => new Set<number>(), 2)
    this._candidateCouldReachFinal = createHighDimensionArray(
      () => 0,
      context.TOTAL_PLAYER,
      context.TOTAL_POS,
    )
  }

  public init(): void {
    this._mustDropPosSet.forEach(set => set.clear())
    this._candidateCouldReachFinal.forEach(item => item.fill(0))

    const { context, _mustDropPosSet, _candidateCouldReachFinal } = this
    const { TOTAL_POS } = context

    // Initialize _candidateCouldReachFinal.
    for (let posId = 0; posId < TOTAL_POS; ++posId) {
      if (context.board[posId] >= 0) continue

      let flag0 = 0
      let flag1 = 0
      for (const dirType of halfDirectionTypes) {
        const bitFlag: number = 1 << dirType
        if (this._couldReachFinalInDirection(0, posId, dirType)) flag0 |= bitFlag
        if (this._couldReachFinalInDirection(1, posId, dirType)) flag1 |= bitFlag
      }

      if (flag0 > 0) _mustDropPosSet[0].add(posId)
      if (flag1 > 0) _mustDropPosSet[1].add(posId)
      _candidateCouldReachFinal[0][posId] = flag0
      _candidateCouldReachFinal[1][posId] = flag1
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

  public mustDropPos(playerId: number): Iterable<number> & { size: number } {
    return this._mustDropPosSet[playerId]
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
      const { _mustDropPosSet, _candidateCouldReachFinal } = this
      const prevFlag0 = _candidateCouldReachFinal[0][posId]
      const prevFlag1 = _candidateCouldReachFinal[1][posId]

      _mustDropPosSet[0].delete(posId)
      _mustDropPosSet[1].delete(posId)

      if (this.context.board[posId] >= 0) {
        _candidateCouldReachFinal[0][posId] = 0
        _candidateCouldReachFinal[1][posId] = 0
        return
      }

      let nextFlag0 = 0
      let nextFlag1 = 0
      for (const dirType of halfDirectionTypes) {
        const bitFlag: number = 1 << dirType
        if (bitFlag & expiredBitset) {
          if (this._couldReachFinalInDirection(0, posId, dirType)) nextFlag0 |= bitFlag
          if (this._couldReachFinalInDirection(1, posId, dirType)) nextFlag1 |= bitFlag
        } else {
          nextFlag0 |= prevFlag0 & bitFlag
          nextFlag1 |= prevFlag1 & bitFlag
        }
      }

      _candidateCouldReachFinal[0][posId] = nextFlag0
      _candidateCouldReachFinal[1][posId] = nextFlag1
      if (nextFlag0 > 0) _mustDropPosSet[0].add(posId)
      if (nextFlag1 > 0) _mustDropPosSet[1].add(posId)
    }
  }

  protected _couldReachFinalInDirection(
    playerId: number,
    posId: number,
    dirType: GomokuDirectionType,
  ): boolean {
    const { context } = this
    const { MAX_ADJACENT, board } = context
    const revDirType: GomokuDirectionType = dirType ^ 1

    let count = 1
    const maxMovableSteps0: number = context.maxMovableSteps(posId, revDirType)
    for (let id = posId, step = 0; step < maxMovableSteps0; ++step) {
      id = context.fastMoveOneStep(id, revDirType)
      if (board[id] !== playerId) break
      count += 1
    }

    const maxMovableSteps2: number = context.maxMovableSteps(posId, dirType)
    for (let id = posId, step = 0; step < maxMovableSteps2; ++step) {
      id = context.fastMoveOneStep(id, dirType)
      if (board[id] !== playerId) break
      count += 1
    }
    return count >= MAX_ADJACENT
  }
}
