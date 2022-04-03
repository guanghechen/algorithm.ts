import type { GomokuDirectionType } from './constant'
import { GomokuDirectionTypes } from './constant'
import type { IGomokuContext } from './context.type'
import type { IGomokuCountMap } from './count-map.type'
import type { IDirCounter } from './types'

const { full: fullDirectionTypes, rightHalf: halfDirectionTypes } = GomokuDirectionTypes

export class GomokuCountMap implements IGomokuCountMap {
  public readonly context: Readonly<IGomokuContext>
  public readonly dirCountMap: number[][]
  protected readonly _rightHalfDirCountMap: IDirCounter[][][] // [dirType][startPosId] => <Counters>

  constructor(context: Readonly<IGomokuContext>) {
    this.context = context
    this.dirCountMap = new Array(fullDirectionTypes.length)
      .fill([])
      .map(() => new Array(context.TOTAL_POS).fill(0))

    this._rightHalfDirCountMap = new Array(fullDirectionTypes.length)
      .fill([])
      .map(() => new Array<IDirCounter[]>(context.TOTAL_POS).fill([]).map(() => []))
  }

  public init(): void {
    const { context, dirCountMap } = this
    const { board } = context

    // Initialize dirCountMap.
    dirCountMap.forEach(idMap => idMap.fill(0))
    context.traverseAllDirections(dirType => posId => {
      const player: number = board[posId]
      if (player < 0) return

      const id2: number = context.safeMoveOneStep(posId, dirType)
      const countMap = dirCountMap[dirType]
      countMap[posId] = id2 >= 0 && board[id2] === player ? countMap[id2] + 1 : 1
    })

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
  }

  public forward(posId: number): void {
    const { context, dirCountMap } = this
    const { board } = context
    const playerId: number = board[posId]

    // Update dirCountMap.
    {
      for (const dirType of fullDirectionTypes) {
        const id2: number = context.safeMoveOneStep(posId, dirType)
        const countMap = dirCountMap[dirType]
        countMap[posId] = id2 >= 0 && board[id2] === playerId ? countMap[id2] + 1 : 1
      }

      for (const dirType of fullDirectionTypes) {
        const revDirType = dirType ^ 1
        const lftCnt: number = dirCountMap[revDirType][posId]
        const rhtCnt: number = dirCountMap[dirType][posId]
        const countMap = dirCountMap[dirType]
        for (let id2: number = posId, i = 1; i < lftCnt; ++i) {
          id2 = context.fastMoveOneStep(id2, revDirType)
          countMap[id2] += rhtCnt
        }
      }
    }

    // update _rightHalfDirCountMap
    for (const dirType of halfDirectionTypes) {
      this._updateHalfDirCounter(playerId, posId, dirType)
    }
  }

  public revert(posId: number): void {
    const { context, dirCountMap } = this

    // Update dirCountMap.
    {
      for (const dirType of fullDirectionTypes) {
        const revDirType = dirType ^ 1
        const lftCnt: number = dirCountMap[revDirType][posId]
        const rhtCnt: number = dirCountMap[dirType][posId]
        const countMap = dirCountMap[dirType]
        for (let posId2: number = posId, i = 1; i < lftCnt; ++i) {
          posId2 = context.fastMoveOneStep(posId2, revDirType)
          countMap[posId2] -= rhtCnt
        }
      }
      for (const dirType of fullDirectionTypes) dirCountMap[dirType][posId] = 0
    }

    // update _rightHalfDirCountMap
    for (const dirType of halfDirectionTypes) {
      this._updateHalfDirCounter(-1, posId, dirType)
    }
  }

  public getDirCounters(
    startPosId: number,
    dirType: GomokuDirectionType,
  ): ReadonlyArray<IDirCounter> {
    return this._rightHalfDirCountMap[dirType][startPosId]
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
