import type { GomokuDirectionType } from './constant'
import { GomokuDirectionTypeBitset, GomokuDirectionTypes } from './constant'
import type { IGomokuContext } from './context.type'
import type { IGomokuCountMap } from './count-map.type'
import type { IDirCounter } from './types'

const { full: fullDirectionTypes, rightHalf: halfDirectionTypes } = GomokuDirectionTypes
const { rightHalf: allDirectionTypeBitset } = GomokuDirectionTypeBitset

export class GomokuCountMap implements IGomokuCountMap {
  public readonly context: Readonly<IGomokuContext>
  protected readonly _mustDropPosSet: Array<Set<number>> // [playerId] => <must-drop position set>
  protected readonly _candidateCouldReachFinal: number[][] // [posId][playerId]
  protected readonly _rightHalfDirCountMap: IDirCounter[][][] // [dirType][startPosId] => <Counters>

  constructor(context: Readonly<IGomokuContext>) {
    this.context = context
    this._mustDropPosSet = new Array(2).fill([]).map(() => new Set<number>())
    this._candidateCouldReachFinal = new Array(context.TOTAL_POS).fill([]).map(() => [0, 0])
    this._rightHalfDirCountMap = new Array(fullDirectionTypes.length)
      .fill([])
      .map(() => new Array<IDirCounter[]>(context.TOTAL_POS).fill([]).map(() => []))
  }

  public init(): void {
    const { context, _mustDropPosSet, _candidateCouldReachFinal } = this
    const { TOTAL_POS, board } = context

    // update _rightHalfDirCountMap
    const { _rightHalfDirCountMap } = this
    for (const dirType of halfDirectionTypes) {
      for (const startPosId of context.getStartPosSet(dirType)) {
        const counters = _rightHalfDirCountMap[dirType][startPosId]

        let index = 0
        const maxSteps: number = context.maxMovableSteps(startPosId, dirType) + 1
        for (
          let i = 0, posId = startPosId, i2: number, posId2: number;
          i < maxSteps;
          i = i2, posId = posId2
        ) {
          const playerId: number = board[posId]
          for (i2 = i + 1, posId2 = posId; i2 < maxSteps; ++i2) {
            posId2 = context.fastMoveOneStep(posId2, dirType)
            if (board[posId2] !== playerId) break
          }
          // eslint-disable-next-line no-plusplus
          counters[index++] = { playerId, count: i2 - i }
        }
        counters.length = index
      }
    }

    // Initialize _candidateCouldReachFinal.
    _mustDropPosSet.forEach(set => set.clear())
    _candidateCouldReachFinal.forEach(item => item.fill(0))
    for (let posId = 0; posId < TOTAL_POS; ++posId) {
      if (context.board[posId] >= 0) continue

      let data0 = 0
      let data1 = 0
      for (const dirType of halfDirectionTypes) {
        const bitFlag: number = 1 << dirType
        if (this._couldReachFinalInDirection(0, posId, dirType)) data0 |= bitFlag
        if (this._couldReachFinalInDirection(1, posId, dirType)) data1 |= bitFlag
      }

      if (data0 > 0) _mustDropPosSet[0].add(posId)
      if (data1 > 0) _mustDropPosSet[1].add(posId)
      _candidateCouldReachFinal[posId][0] = data0
      _candidateCouldReachFinal[posId][1] = data1
    }
  }

  public forward(posId: number): void {
    const playerId: number = this.context.board[posId]

    // update _rightHalfDirCountMap
    for (const dirType of halfDirectionTypes) {
      this._updateHalfDirCounter(playerId, posId, dirType)
    }

    // Update _candidateCouldReachFinal.
    this._updateRelatedCouldReachFinal(posId)
  }

  public revert(posId: number): void {
    // update _rightHalfDirCountMap
    for (const dirType of halfDirectionTypes) {
      this._updateHalfDirCounter(-1, posId, dirType)
    }

    // Update _dirCountMap.
    this._updateRelatedCouldReachFinal(posId)
  }

  public getDirCounters(
    startPosId: number,
    dirType: GomokuDirectionType,
  ): ReadonlyArray<IDirCounter> {
    return this._rightHalfDirCountMap[dirType][startPosId]
  }

  public mustDropPos(playerId: number): Iterable<number> {
    return this._mustDropPosSet[playerId]
  }

  public candidateCouldReachFinal(playerId: number, posId: number): boolean {
    return this._candidateCouldReachFinal[posId][playerId] > 0
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
      const prevData0 = _candidateCouldReachFinal[posId][0]
      const prevData1 = _candidateCouldReachFinal[posId][1]
      _mustDropPosSet[0].delete(posId)
      _mustDropPosSet[1].delete(posId)

      if (this.context.board[posId] >= 0) {
        _candidateCouldReachFinal[posId][0] = 0
        _candidateCouldReachFinal[posId][1] = 0
        return
      }

      let nextData0 = 0
      let nextData1 = 0
      for (const dirType of halfDirectionTypes) {
        const bitFlag: number = 1 << dirType
        if (bitFlag & expiredBitset) {
          if (this._couldReachFinalInDirection(0, posId, dirType)) nextData0 |= bitFlag
          if (this._couldReachFinalInDirection(1, posId, dirType)) nextData1 |= bitFlag
        } else {
          nextData0 |= prevData0 & bitFlag
          nextData1 |= prevData1 & bitFlag
        }
      }

      _candidateCouldReachFinal[posId][0] = nextData0
      _candidateCouldReachFinal[posId][1] = nextData1
      if (nextData0 > 0) _mustDropPosSet[0].add(posId)
      if (nextData1 > 0) _mustDropPosSet[1].add(posId)
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

  protected _updateHalfDirCounter(
    playerId: number,
    posId: number,
    dirType: GomokuDirectionType,
  ): void {
    const { context } = this
    const revDirType: GomokuDirectionType = dirType ^ 1
    const startPosId = context.getStartPosId(posId, dirType)
    const counters = this._rightHalfDirCountMap[dirType][startPosId]

    let index = 0
    let remain: number = context.maxMovableSteps(posId, revDirType) + 1
    for (; index < counters.length; ++index) {
      const cnt: number = counters[index].count
      if (cnt >= remain) break
      remain -= cnt
    }

    if (remain === 1) {
      if (counters[index].count === 1) {
        const isSameWithLeft: boolean = index > 0 && counters[index - 1].playerId === playerId
        const isSameWithRight: boolean =
          index + 1 < counters.length && counters[index + 1].playerId === playerId
        if (isSameWithLeft) {
          if (isSameWithRight) {
            counters[index - 1].count += 1 + counters[index + 1].count
            counters.splice(index, 2)
          } else {
            counters[index - 1].count += 1
            counters.splice(index, 1)
          }
        } else {
          if (isSameWithRight) {
            counters[index + 1].count += 1
            counters.splice(index, 1)
          } else {
            counters[index].playerId = playerId
          }
        }
      } else {
        counters[index].count -= 1
        if (index > 0 && counters[index - 1].playerId === playerId) {
          counters[index - 1].count += 1
        } else {
          counters.splice(index, 0, { playerId, count: 1 })
        }
      }
    } else if (remain < counters[index].count) {
      const { playerId: hitPlayerId, count: hitCount } = counters[index]
      counters.splice(
        index,
        1,
        { playerId: hitPlayerId, count: remain - 1 },
        { playerId, count: 1 },
        { playerId: hitPlayerId, count: hitCount - remain },
      )
    } else {
      counters[index].count -= 1
      if (index + 1 < counters.length && counters[index + 1].playerId === playerId) {
        counters[index + 1].count += 1
      } else {
        counters.splice(index + 1, 0, { playerId, count: 1 })
      }
    }
  }
}
