import type { GomokuDirectionType } from './constant'
import {
  continuouslyShapeScoreMap,
  gomokuDirectionTypes,
  gomokuDirections,
  leftHalfGomokuDirectionTypes,
} from './constant'
import type { GomokuContext } from './GomokuContext'
import type { IShapeCount } from './types'

export class GomokuCountMap {
  protected readonly context: GomokuContext
  protected readonly board: Readonly<Int32Array>
  protected readonly dirCountMap: Uint32Array[]
  protected readonly continuouslyShapeCountMap: IShapeCount[][]

  constructor(context: GomokuContext, board: Readonly<Int32Array>) {
    this.context = context
    this.board = board
    this.dirCountMap = new Array(gomokuDirections.length)
      .fill([])
      .map(() => new Uint32Array(context.TOTAL_POS))
    this.continuouslyShapeCountMap = new Array(context.TOTAL_PLAYERS)
      .fill([])
      .map(() => new Array(context.MAX_POSSIBLE_INLINE + 1).fill([]).map(() => [0, 0, 0]))
  }

  public init(): void {
    const { context, board, dirCountMap, continuouslyShapeCountMap } = this
    for (const dirType of gomokuDirectionTypes) dirCountMap[dirType].fill(0)

    context.traverseAllDirections((r, c, dirType) => {
      const id: number = context.idx(r, c)
      const player: number = board[id]
      if (player >= 0) {
        const [r2, c2] = context.move(r, c, dirType, 1)
        const id2: number = context.idxIfValid(r2, c2)
        const countMap = dirCountMap[dirType]
        countMap[id] = id2 >= 0 && board[id2] === player ? countMap[id2] + 1 : 1
      }
    })

    context.traverseLeftDirections((r, c, dirType) => {
      const id: number = context.idx(r, c)
      const player: number = board[id]
      if (player >= 0) {
        const [r0, c0] = context.move(r, c, dirType, -1)
        const d0: number = context.idxIfValid(r0, c0)
        if (d0 < 0 || board[d0] !== player) {
          const [cnt, freeSide] = this.detectContinuousLine(r, c, player, dirType)
          continuouslyShapeCountMap[player][cnt][freeSide] += 1
        }
      }
    })
  }

  public beforeForward(r: number, c: number, _player: number): void {
    const { context, board, continuouslyShapeCountMap } = this
    for (const dirType of gomokuDirectionTypes) {
      const [r2, c2] = context.move(r, c, dirType, 1)
      const id2: number = context.idxIfValid(r2, c2)
      if (id2 >= 0 && board[id2] >= 0) {
        const player2: number = board[id2]
        const [cnt, freeSide] = this.detectContinuousLine(r2, c2, player2, dirType)
        continuouslyShapeCountMap[player2][cnt][freeSide] -= 1
      }
    }
  }

  public afterForward(r: number, c: number, player: number): void {
    const { context, board, dirCountMap, continuouslyShapeCountMap } = this
    const id: number = context.idx(r, c)

    // Update dirCountMap.
    {
      for (const dirType of gomokuDirectionTypes) {
        const [r2, c2] = context.move(r, c, dirType, 1)
        const id2: number = context.idxIfValid(r2, c2)
        const countMap = dirCountMap[dirType]
        countMap[id] = id2 >= 0 && board[id2] === player ? countMap[id2] + 1 : 1
      }

      for (const dirType of gomokuDirectionTypes) {
        const [dr, dc] = gomokuDirections[dirType]
        const countMap = dirCountMap[dirType]
        const cnt: number = countMap[id]
        for (let r2: number = r, c2: number = c; ; ) {
          r2 = r2 - dr
          c2 = c2 - dc
          if (context.isInvalidPos(r2, c2)) break
          const id2: number = context.idx(r2, c2)
          if (board[id2] !== player) break
          countMap[id2] += cnt
        }
      }
    }

    // Update continuouslyShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const lftCnt: number = dirCountMap[revDirType][id]
      const rhtCnt: number = dirCountMap[dirType][id]
      const [startR, startC] = context.move(r, c, dirType, rhtCnt - 1)
      const [cnt, freeSide] = this.detectContinuousLine(startR, startC, player, revDirType)
      continuouslyShapeCountMap[player][cnt][freeSide] += 1

      if (lftCnt === 1) {
        const [r0, c0] = context.move(r, c, revDirType, 1)
        const d0: number = context.idxIfValid(r0, c0)
        if (d0 >= 0 && board[d0] >= 0) {
          const player0: number = board[d0]
          const [cnt0, freeSide0] = this.detectContinuousLine(r0, c0, player0, revDirType)
          continuouslyShapeCountMap[player0][cnt0][freeSide0] += 1
        }
      }

      if (rhtCnt === 1) {
        const [r2, c2] = context.move(r, c, dirType, 1)
        const d2: number = context.idxIfValid(r2, c2)
        if (d2 >= 0 && board[d2] >= 0) {
          const player2: number = board[d2]
          const [cnt2, freeSide2] = this.detectContinuousLine(r2, c2, player2, dirType)
          continuouslyShapeCountMap[player2][cnt2][freeSide2] += 1
        }
      }
    }
  }

  public beforeRollback(r: number, c: number, player: number): void {
    const { context, board, dirCountMap, continuouslyShapeCountMap } = this
    const id: number = context.idx(r, c)
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const lftCnt: number = dirCountMap[revDirType][id]
      const rhtCnt: number = dirCountMap[dirType][id]
      const [startR, startC] = context.move(r, c, dirType, rhtCnt - 1)
      const [cnt, freeSide] = this.detectContinuousLine(startR, startC, player, revDirType)
      continuouslyShapeCountMap[player][cnt][freeSide] -= 1

      if (lftCnt === 1) {
        const [r0, c0] = context.move(r, c, revDirType, 1)
        const d0: number = context.idxIfValid(r0, c0)
        if (d0 >= 0 && board[d0] >= 0) {
          const player0: number = board[d0]
          const [cnt0, freeSide0] = this.detectContinuousLine(r0, c0, player0, revDirType)
          continuouslyShapeCountMap[player0][cnt0][freeSide0] -= 1
        }
      }

      if (rhtCnt === 1) {
        const [r2, c2] = context.move(r, c, dirType, 1)
        const d2: number = context.idxIfValid(r2, c2)
        if (d2 >= 0 && board[d2] >= 0) {
          const player2: number = board[d2]
          const [cnt2, freeSide2] = this.detectContinuousLine(r2, c2, player2, dirType)
          continuouslyShapeCountMap[player2][cnt2][freeSide2] -= 1
        }
      }
    }
  }

  public afterRollback(r: number, c: number, player: number): void {
    const { context, board, dirCountMap, continuouslyShapeCountMap } = this
    const id: number = context.idx(r, c)

    // Update dirCountMap.
    {
      for (const dirType of gomokuDirectionTypes) {
        const [dr, dc] = gomokuDirections[dirType]
        const countMap = dirCountMap[dirType]
        const cnt: number = countMap[id]
        for (let r2: number = r, c2: number = c; ; ) {
          r2 = r2 - dr
          c2 = c2 - dc
          if (context.isInvalidPos(r2, c2)) break
          const id2: number = context.idx(r2, c2)
          if (board[id2] !== player) break
          countMap[id2] -= cnt
        }
      }

      for (const dirType of gomokuDirectionTypes) {
        dirCountMap[dirType][id] = 0
      }
    }

    // Update continuouslyShapeCountMap.
    for (const dirType of gomokuDirectionTypes) {
      const [r2, c2] = context.move(r, c, dirType, 1)
      const id2: number = context.idxIfValid(r2, c2)
      if (id2 >= 0 && board[id2] >= 0) {
        const player2: number = board[id2]
        const [cnt, freeSide] = this.detectContinuousLine(r2, c2, player2, dirType)
        continuouslyShapeCountMap[player2][cnt][freeSide] += 1
      }
    }
  }

  public score(player: number): number {
    if (this.isReachTheLimit()) return Number.MAX_SAFE_INTEGER

    let score = 0
    const { context, continuouslyShapeCountMap } = this
    for (let i = 1; i < context.MAX_INLINE; ++i) {
      const [a, b, c] = continuouslyShapeCountMap[player][i]
      const [s1 = 0, s2 = 32 * 2 ** i, s3 = 128 * 2 ** i] = continuouslyShapeScoreMap[i]
      score += a * s1 + b * s2 + c * s3
    }
    return score
  }

  // Check if it's endgame.
  public isReachTheLimit(): boolean {
    const { context, continuouslyShapeCountMap } = this
    const { MAX_INLINE, MAX_POSSIBLE_INLINE } = context
    for (let player = 0; player < context.TOTAL_PLAYERS; ++player) {
      const shapeCountMap: IShapeCount[] = continuouslyShapeCountMap[player]
      for (let count = MAX_INLINE; count <= MAX_POSSIBLE_INLINE; ++count) {
        const shapeCount: IShapeCount = shapeCountMap[count]
        if (shapeCount.some(Boolean)) return true
      }
    }
    return false
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public toJSON() {
    const { dirCountMap, continuouslyShapeCountMap } = this
    return { dirCountMap, continuouslyShapeCountMap }
  }

  protected detectContinuousLine(
    startR: number,
    startC: number,
    player: number,
    dirType: GomokuDirectionType,
  ): [cnt: number, freeSide: number] {
    const { context, board, dirCountMap } = this
    let freeSide = 2

    const [r0, c0] = context.move(startR, startC, dirType, -1)
    const d0: number = context.idxIfValid(r0, c0)
    if (d0 < 0 || board[d0] >= 0) freeSide -= 1

    const id: number = context.idxIfValid(startR, startC)
    const cnt = dirCountMap[dirType][id]
    const [r2, c2] = context.move(startR, startC, dirType, cnt)
    const d2 = context.idxIfValid(r2, c2)
    if (d2 < 0 || (board[d2] >= 0 && board[d2] !== player)) freeSide -= 1
    return [cnt, freeSide]
  }
}
