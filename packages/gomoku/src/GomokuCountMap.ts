import type { GomokuDirectionType } from './constant'
import {
  continuouslyShapeScoreMap,
  gomokuDirectionTypes,
  gomokuDirections,
  leftHalfGomokuDirectionTypes,
} from './constant'
import type { GomokuContext } from './GomokuContext'
import type { IShapeCount } from './types'

type IFreeSideResult = [cnt: number, countOfFreeSide: 0 | 1]

export class GomokuCountMap {
  protected readonly context: GomokuContext
  protected readonly board: Readonly<Int32Array>
  protected readonly dirCountMap: Uint32Array[]
  protected readonly continuouslyShapeCountMap: IShapeCount[][]
  protected readonly gapShapeCountMap: IShapeCount[][]

  constructor(context: GomokuContext, board: Readonly<Int32Array>) {
    this.context = context
    this.board = board
    this.dirCountMap = new Array(gomokuDirections.length)
      .fill([])
      .map(() => new Uint32Array(context.TOTAL_POS))
    this.continuouslyShapeCountMap = new Array(context.TOTAL_PLAYERS)
      .fill([])
      .map(() => new Array(context.MAX_POSSIBLE_INLINE + 1).fill([]).map(() => [0, 0, 0]))
    this.gapShapeCountMap = new Array(context.TOTAL_PLAYERS)
      .fill([])
      .map(() => new Array(context.MAX_POSSIBLE_INLINE + 1).fill([]).map(() => [0, 0, 0]))
  }

  public init(): void {
    this.dirCountMap.forEach(idMap => idMap.fill(0))
    this.continuouslyShapeCountMap.forEach(maps => maps.forEach(countMap => countMap.fill(0)))
    this.gapShapeCountMap.forEach(maps => maps.forEach(countMap => countMap.fill(0)))
    const { context, board, dirCountMap, continuouslyShapeCountMap, gapShapeCountMap } = this

    // Initialize dirCountMap.
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

    // Initialize continuouslyShapeCountMap.
    context.traverseLeftDirections((r, c, dirType) => {
      const id: number = context.idx(r, c)
      const player: number = board[id]
      if (player >= 0 && dirCountMap[dirType][id] === 1) {
        const [cnt, freeSide] = this.detectContinuousLine(r, c, dirType)
        continuouslyShapeCountMap[player][cnt][freeSide] += 1
      }
    })

    // Initialize gapShapeCountMap.
    context.traverseLeftDirections((r, c, dirType) => {
      const id: number = context.idx(r, c)
      const revDirType: GomokuDirectionType = dirType ^ 1
      if (board[id] < 0) {
        const [r0, c0] = context.move(r, c, revDirType, 1)
        const id0: number = context.idxIfValid(r0, c0)
        if (id0 < 0 || board[id0] < 0) return

        const player: number = board[id0]
        const [r2, c2] = context.move(r, c, dirType, 1)
        const id2: number = context.idxIfValid(r2, c2)
        if (id2 < 0 || board[id2] !== player) return

        const [cnt0, isFreeSide0] = this.isFreeSide(r0, c0, revDirType)
        const [cnt2, isFreeSide2] = this.isFreeSide(r2, c2, dirType)
        const cnt: number = cnt0 + cnt2
        const countOfFreeSide: number = isFreeSide0 + isFreeSide2
        gapShapeCountMap[player][cnt][countOfFreeSide] += 1
      }
    })
  }

  public beforeForward(r: number, c: number, player: number): void {
    const { context, board, continuouslyShapeCountMap, gapShapeCountMap } = this

    // Update continuouslyShapeCountMap.
    context.visitValidNeighbors(r, c, (r2, c2, dirType) => {
      const id2: number = context.idx(r2, c2)
      const player2: number = board[id2]
      if (player2 >= 0) {
        const [cnt2, freeSide2] = this.detectContinuousLine(r2, c2, dirType)
        continuouslyShapeCountMap[player2][cnt2][freeSide2] -= 1
      }
    })

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const [r0, c0] = context.move(r, c, revDirType, 1)
      const id0: number = context.idxIfValid(r0, c0)
      const [r2, c2] = context.move(r, c, dirType, 1)
      const id2: number = context.idxIfValid(r2, c2)

      if (id0 >= 0 && id2 >= 0 && board[id0] === board[id2] && board[id0] >= 0) {
        const player0: number = board[id0]
        const [cnt0, isFreeSide0] = this.isFreeSide(r0, c0, revDirType)
        const [cnt2, isFreeSide2] = this.isFreeSide(r2, c2, dirType)
        const cnt: number = cnt0 + cnt2
        const countOfFreeSide: number = isFreeSide0 + isFreeSide2
        gapShapeCountMap[player0][cnt][countOfFreeSide] -= 1
      }

      if (id0 >= 0 && board[id0] >= 0) {
        const player0: number = board[id0]
        const [cnt0, countOfFreeSide0] = this.detectGapContinuousLine(r0, c0, player0, revDirType)
        if (cnt0 > -1) gapShapeCountMap[player0][cnt0][countOfFreeSide0] -= 1
      }

      if (id2 >= 0 && board[id2] >= 0) {
        const player2: number = board[id2]
        const [cnt2, countOfFreeSide2] = this.detectGapContinuousLine(r2, c2, player2, dirType)
        if (cnt2 > -1) gapShapeCountMap[player2][cnt2][countOfFreeSide2] -= 1
      }
    }
  }

  public afterForward(r: number, c: number, player: number): void {
    const { context, board, dirCountMap, continuouslyShapeCountMap, gapShapeCountMap } = this
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
      const [cnt, freeSide] = this.detectContinuousLine(r, c, dirType)
      continuouslyShapeCountMap[player][cnt][freeSide] += 1

      const revDirType: GomokuDirectionType = dirType ^ 1
      if (dirCountMap[revDirType][id] === 1) {
        const [r0, c0] = context.move(r, c, revDirType, 1)
        const d0: number = context.idxIfValid(r0, c0)
        if (d0 >= 0 && board[d0] >= 0) {
          const player0: number = board[d0]
          const [cnt0, freeSide0] = this.detectContinuousLine(r0, c0, revDirType)
          continuouslyShapeCountMap[player0][cnt0][freeSide0] += 1
        }
      }

      if (dirCountMap[dirType][id] === 1) {
        const [r2, c2] = context.move(r, c, dirType, 1)
        const d2: number = context.idxIfValid(r2, c2)
        if (d2 >= 0 && board[d2] >= 0) {
          const player2: number = board[d2]
          const [cnt2, freeSide2] = this.detectContinuousLine(r2, c2, dirType)
          continuouslyShapeCountMap[player2][cnt2][freeSide2] += 1
        }
      }
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const [cnt0, countOfFreeSide0] = this.detectGapContinuousLine(r, c, player, revDirType)
      if (cnt0 > -1) gapShapeCountMap[player][cnt0][countOfFreeSide0] += 1
      else {
        const [r00, c00] = context.move(r, c, revDirType, dirCountMap[revDirType][id])
        const id00: number = context.idxIfValid(r00, c00)
        if (id00 >= 0 && board[id00] >= 0) {
          const player00: number = board[id00]
          const [cnt00, countOfFreeSide00] = this.detectGapContinuousLine(
            r00,
            c00,
            player00,
            revDirType,
          )
          if (cnt00 > -1) gapShapeCountMap[player00][cnt00][countOfFreeSide00] += 1
        }
      }

      const [cnt2, countOfFreeSide2] = this.detectGapContinuousLine(r, c, player, dirType)
      if (cnt2 > -1) gapShapeCountMap[player][cnt2][countOfFreeSide2] += 1
      else {
        const [r22, c22] = context.move(r, c, dirType, dirCountMap[dirType][id])
        const id22: number = context.idxIfValid(r22, c22)
        if (id22 >= 0 && board[id22] >= 0) {
          const player22: number = board[id22]
          const [cnt22, countOfFreeSide22] = this.detectGapContinuousLine(
            r22,
            c22,
            player22,
            dirType,
          )
          if (cnt22 > -1) gapShapeCountMap[player22][cnt22][countOfFreeSide22] += 1
        }
      }
    }
  }

  public beforeRollback(r: number, c: number, player: number): void {
    const { context, board, dirCountMap, continuouslyShapeCountMap, gapShapeCountMap } = this
    const id: number = context.idx(r, c)

    // Update continuouslyShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const [cnt, freeSide] = this.detectContinuousLine(r, c, dirType)
      continuouslyShapeCountMap[player][cnt][freeSide] -= 1

      const revDirType: GomokuDirectionType = dirType ^ 1
      if (dirCountMap[revDirType][id] === 1) {
        const [r0, c0] = context.move(r, c, revDirType, 1)
        const d0: number = context.idxIfValid(r0, c0)
        if (d0 >= 0 && board[d0] >= 0) {
          const player0: number = board[d0]
          const [cnt0, freeSide0] = this.detectContinuousLine(r0, c0, revDirType)
          continuouslyShapeCountMap[player0][cnt0][freeSide0] -= 1
        }
      }

      if (dirCountMap[dirType][id] === 1) {
        const [r2, c2] = context.move(r, c, dirType, 1)
        const d2: number = context.idxIfValid(r2, c2)
        if (d2 >= 0 && board[d2] >= 0) {
          const player2: number = board[d2]
          const [cnt2, freeSide2] = this.detectContinuousLine(r2, c2, dirType)
          continuouslyShapeCountMap[player2][cnt2][freeSide2] -= 1
        }
      }
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const [cnt0, countOfFreeSide0] = this.detectGapContinuousLine(r, c, player, revDirType)
      if (cnt0 > -1) gapShapeCountMap[player][cnt0][countOfFreeSide0] -= 1
      else {
        const [r00, c00] = context.move(r, c, revDirType, dirCountMap[revDirType][id])
        const id00: number = context.idxIfValid(r00, c00)
        if (id00 >= 0 && board[id00] >= 0) {
          const player00: number = board[id00]
          const [cnt00, countOfFreeSide00] = this.detectGapContinuousLine(
            r00,
            c00,
            player00,
            revDirType,
          )
          if (cnt00 > -1) gapShapeCountMap[player00][cnt00][countOfFreeSide00] -= 1
        }
      }

      const [cnt2, countOfFreeSide2] = this.detectGapContinuousLine(r, c, player, dirType)
      if (cnt2 > -1) gapShapeCountMap[player][cnt2][countOfFreeSide2] -= 1
      else {
        const [r22, c22] = context.move(r, c, dirType, dirCountMap[dirType][id])
        const id22: number = context.idxIfValid(r22, c22)
        if (id22 >= 0 && board[id22] >= 0) {
          const player22: number = board[id22]
          const [cnt22, countOfFreeSide22] = this.detectGapContinuousLine(
            r22,
            c22,
            player22,
            dirType,
          )
          if (cnt22 > -1) gapShapeCountMap[player22][cnt22][countOfFreeSide22] -= 1
        }
      }
    }
  }

  public afterRollback(r: number, c: number, player: number): void {
    const { context, board, dirCountMap, continuouslyShapeCountMap, gapShapeCountMap } = this
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
    context.visitValidNeighbors(r, c, (r2, c2, dirType) => {
      const id2: number = context.idx(r2, c2)
      const player2: number = board[id2]
      if (player2 >= 0) {
        const [cnt2, freeSide2] = this.detectContinuousLine(r2, c2, dirType)
        continuouslyShapeCountMap[player2][cnt2][freeSide2] += 1
      }
    })

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const [r0, c0] = context.move(r, c, revDirType, 1)
      const id0: number = context.idxIfValid(r0, c0)
      const [r2, c2] = context.move(r, c, dirType, 1)
      const id2: number = context.idxIfValid(r2, c2)

      if (id0 >= 0 && id2 >= 0 && board[id0] === board[id2] && board[id0] >= 0) {
        const player0: number = board[id0]
        const [cnt0, isFreeSide0] = this.isFreeSide(r0, c0, revDirType)
        const [cnt2, isFreeSide2] = this.isFreeSide(r2, c2, dirType)
        const cnt: number = cnt0 + cnt2
        const countOfFreeSide: number = isFreeSide0 + isFreeSide2
        gapShapeCountMap[player0][cnt][countOfFreeSide] += 1
      }

      if (id0 >= 0 && board[id0] >= 0) {
        const player0: number = board[id0]
        const [cnt0, countOfFreeSide0] = this.detectGapContinuousLine(r0, c0, player0, revDirType)
        if (cnt0 > -1) gapShapeCountMap[player0][cnt0][countOfFreeSide0] += 1
      }

      if (id2 >= 0 && board[id2] >= 0) {
        const player2: number = board[id2]
        const [cnt2, countOfFreeSide2] = this.detectGapContinuousLine(r2, c2, player2, dirType)
        if (cnt2 > -1) gapShapeCountMap[player2][cnt2][countOfFreeSide2] += 1
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
    const { dirCountMap, continuouslyShapeCountMap, gapShapeCountMap } = this
    return { dirCountMap, continuouslyShapeCountMap, gapShapeCountMap }
  }

  protected detectContinuousLine(
    r: number,
    c: number,
    dirType: GomokuDirectionType,
  ): [cnt: number, countOfFreeSide: number] {
    const revDirType: GomokuDirectionType = dirType ^ 1
    const [cnt0, isFreeSide0] = this.isFreeSide(r, c, revDirType)
    const [cnt2, isFreeSide2] = this.isFreeSide(r, c, dirType)
    const countOfFreeSide: number = isFreeSide0 + isFreeSide2
    return [cnt0 + cnt2 - 1, countOfFreeSide]
  }

  protected detectGapContinuousLine(
    r: number,
    c: number,
    player: number,
    dirType: GomokuDirectionType,
  ): [cnt: number, countOfFreeSide: number] {
    const revDirType: GomokuDirectionType = dirType ^ 1
    const [cnt0, isFreeSide0] = this.isFreeSide(r, c, revDirType)
    const [cnt2, isFreeSide2] = this.isFreeSide(r, c, dirType)

    if (isFreeSide2) {
      const { context, board } = this
      const [r22, c22] = context.move(r, c, dirType, cnt2 + 1)
      const id22: number = context.idxIfValid(r22, c22)
      if (id22 >= 0 && board[id22] === player) {
        const [cnt22, isFreeSide22] = this.isFreeSide(r22, c22, dirType)
        const countOfFreeSide: number = isFreeSide0 + isFreeSide22
        const cnt: number = cnt0 + cnt2 - 1 + cnt22
        return [cnt, countOfFreeSide]
      }
    }
    return [-1, -1]
  }

  protected isFreeSide(
    r: number,
    c: number,
    dirType: GomokuDirectionType,
  ): [cnt: number, countOfFreeSide: 0 | 1] {
    const id: number = this.context.idx(r, c)
    const { context, dirCountMap, board } = this
    const cnt = dirCountMap[dirType][id]
    const [r2, c2] = context.move(r, c, dirType, cnt)
    const id2 = context.idxIfValid(r2, c2)
    const result = [cnt, id2 >= 0 && board[id2] < 0 ? 1 : 0] as [number, 0 | 1]
    return result
  }
}
