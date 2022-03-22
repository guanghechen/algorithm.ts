import type { GomokuDirectionType } from './constant'
import { gomokuDirectionTypes, gomokuDirections, leftHalfGomokuDirectionTypes } from './constant'
import type { GomokuContext } from './GomokuContext'
import type { IGomokuBoard, IScoreMap, IShapeCount } from './types'

export class GomokuCountMap {
  protected readonly context: Readonly<GomokuContext>
  protected readonly board: Readonly<IGomokuBoard>
  protected readonly dirCountMap: Uint32Array[]
  protected readonly conShapeCountMap: IShapeCount[][]
  protected readonly gapShapeCountMap: IShapeCount[][]
  protected readonly scoreMap: IScoreMap

  constructor(
    context: Readonly<GomokuContext>,
    board: Readonly<IGomokuBoard>,
    scoreMap: IScoreMap,
  ) {
    this.context = context
    this.board = board
    this.dirCountMap = new Array(gomokuDirections.length)
      .fill([])
      .map(() => new Uint32Array(context.TOTAL_POS))
    this.conShapeCountMap = new Array(context.TOTAL_PLAYERS)
      .fill([])
      .map(() => new Array(context.MAX_INLINE + 1).fill([]).map(() => [0, 0, 0]))
    this.gapShapeCountMap = new Array(context.TOTAL_PLAYERS)
      .fill([])
      .map(() => new Array(context.MAX_INLINE + 1).fill([]).map(() => [0, 0, 0]))
    this.scoreMap = scoreMap
  }

  public init(): void {
    this.dirCountMap.forEach(idMap => idMap.fill(0))
    this.conShapeCountMap.forEach(maps => maps.forEach(countMap => countMap.fill(0)))
    this.gapShapeCountMap.forEach(maps => maps.forEach(countMap => countMap.fill(0)))
    const { context, board, dirCountMap } = this

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

    // Initialize conShapeCountMap.
    context.traverseLeftDirections((r, c, dirType) => {
      const id: number = context.idx(r, c)
      const player: number = board[id]
      if (player >= 0 && dirCountMap[dirType][id] === 1) {
        const revDirType: GomokuDirectionType = dirType ^ 1
        const cnt: number = dirCountMap[revDirType][id]
        this.updateConShapeCountMap(player, r, c, cnt, revDirType, 1)
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

        const [cnt0, countOfFreeSide0] = this.detectFreeSide(r0, c0, revDirType)
        const [cnt2, countOfFreeSide2] = this.detectFreeSide(r2, c2, dirType)
        const countOfFreeSide: number = countOfFreeSide0 + countOfFreeSide2
        this.updateGapShapeCountMap(player, cnt0, cnt2, countOfFreeSide, 1)
      }
    })
  }

  public beforeForward(r: number, c: number): void {
    const { context, board } = this

    // Update conShapeCountMap.
    for (const dirType of gomokuDirectionTypes) {
      this.updateRelatedConShapeCountMap(r, c, 1, dirType, -1)
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const [r0, c0] = context.move(r, c, revDirType, 1)
      const id0: number = context.idxIfValid(r0, c0)
      const [r2, c2] = context.move(r, c, dirType, 1)
      const id2: number = context.idxIfValid(r2, c2)

      if (id0 >= 0 && id2 >= 0 && board[id0] === board[id2] && board[id0] >= 0) {
        const player0: number = board[id0]
        const [cnt0, countOfFreeSide0] = this.detectFreeSide(r0, c0, revDirType)
        const [cnt2, countOfFreeSide2] = this.detectFreeSide(r2, c2, dirType)
        const countOfFreeSide: number = countOfFreeSide0 + countOfFreeSide2
        this.updateGapShapeCountMap(player0, cnt0, cnt2, countOfFreeSide, -1)
      }

      if (id0 >= 0 && board[id0] >= 0) {
        const player0: number = board[id0]
        const gapShape = this.detectGapContinuousLine(r0, c0, player0, revDirType)
        if (gapShape) {
          const [lftCnt, rhtCnt, countOfFreeSide] = gapShape
          this.updateGapShapeCountMap(player0, lftCnt, rhtCnt, countOfFreeSide, -1)
        }
      }

      if (id2 >= 0 && board[id2] >= 0) {
        const player2: number = board[id2]
        const gapShape = this.detectGapContinuousLine(r2, c2, player2, dirType)
        if (gapShape) {
          const [lftCnt, rhtCnt, countOfFreeSide] = gapShape
          this.updateGapShapeCountMap(player2, lftCnt, rhtCnt, countOfFreeSide, -1)
        }
      }
    }
  }

  public afterForward(r: number, c: number): void {
    const { context, board, dirCountMap } = this
    const id: number = context.idx(r, c)
    const player: number = board[id]

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

    // Update conShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const lftCnt: number = dirCountMap[revDirType][id]
      const rhtCnt: number = dirCountMap[dirType][id]
      const [startR, startC] = context.move(r, c, revDirType, lftCnt - 1)
      this.updateConShapeCountMap(player, startR, startC, lftCnt + rhtCnt - 1, dirType, 1)

      // Update left
      this.updateRelatedConShapeCountMap(r, c, lftCnt, revDirType, 1)

      // Update right
      this.updateRelatedConShapeCountMap(r, c, rhtCnt, dirType, 1)
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const gapShape0 = this.detectGapContinuousLine(r, c, player, revDirType)
      if (gapShape0) {
        const [lftCnt, rhtCnt, countOfFreeSide] = gapShape0
        this.updateGapShapeCountMap(player, lftCnt, rhtCnt, countOfFreeSide, 1)
      } else {
        const [r00, c00] = context.move(r, c, revDirType, dirCountMap[revDirType][id])
        const id00: number = context.idxIfValid(r00, c00)
        if (id00 >= 0 && board[id00] >= 0) {
          const player00: number = board[id00]
          const gapShape00 = this.detectGapContinuousLine(r00, c00, player00, revDirType)
          if (gapShape00) {
            const [lftCnt, rhtCnt, countOfFreeSide] = gapShape00
            this.updateGapShapeCountMap(player00, lftCnt, rhtCnt, countOfFreeSide, 1)
          }
        }
      }

      const gapShape2 = this.detectGapContinuousLine(r, c, player, dirType)
      if (gapShape2) {
        const [lftCnt, rhtCnt, countOfFreeSide] = gapShape2
        this.updateGapShapeCountMap(player, lftCnt, rhtCnt, countOfFreeSide, 1)
      } else {
        const [r22, c22] = context.move(r, c, dirType, dirCountMap[dirType][id])
        const id22: number = context.idxIfValid(r22, c22)
        if (id22 >= 0 && board[id22] >= 0) {
          const player22: number = board[id22]
          const gapShape22 = this.detectGapContinuousLine(r22, c22, player22, dirType)
          if (gapShape22) {
            const [lftCnt, rhtCnt, countOfFreeSide] = gapShape22
            this.updateGapShapeCountMap(player22, lftCnt, rhtCnt, countOfFreeSide, 1)
          }
        }
      }
    }
  }

  public beforeRollback(r: number, c: number): void {
    const { context, board, dirCountMap } = this
    const id: number = context.idx(r, c)
    const player: number = board[id]

    // Update conShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const lftCnt: number = dirCountMap[revDirType][id]
      const rhtCnt: number = dirCountMap[dirType][id]
      const [startR, startC] = context.move(r, c, revDirType, lftCnt - 1)
      this.updateConShapeCountMap(player, startR, startC, lftCnt + rhtCnt - 1, dirType, -1)

      // Update left
      this.updateRelatedConShapeCountMap(r, c, lftCnt, revDirType, -1)

      // Update right
      this.updateRelatedConShapeCountMap(r, c, rhtCnt, dirType, -1)
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const gapShape0 = this.detectGapContinuousLine(r, c, player, revDirType)
      if (gapShape0) {
        const [lftCnt, rhtCnt, countOfFreeSide] = gapShape0
        this.updateGapShapeCountMap(player, lftCnt, rhtCnt, countOfFreeSide, -1)
      } else {
        const [r00, c00] = context.move(r, c, revDirType, dirCountMap[revDirType][id])
        const id00: number = context.idxIfValid(r00, c00)
        if (id00 >= 0 && board[id00] >= 0) {
          const player00: number = board[id00]
          const gapShape00 = this.detectGapContinuousLine(r00, c00, player00, revDirType)
          if (gapShape00) {
            const [lftCnt, rhtCnt, countOfFreeSide] = gapShape00
            this.updateGapShapeCountMap(player00, lftCnt, rhtCnt, countOfFreeSide, -1)
          }
        }
      }

      const gapShape2 = this.detectGapContinuousLine(r, c, player, dirType)
      if (gapShape2) {
        const [lftCnt, rhtCnt, countOfFreeSide] = gapShape2
        this.updateGapShapeCountMap(player, lftCnt, rhtCnt, countOfFreeSide, -1)
      } else {
        const [r22, c22] = context.move(r, c, dirType, dirCountMap[dirType][id])
        const id22: number = context.idxIfValid(r22, c22)
        if (id22 >= 0 && board[id22] >= 0) {
          const player22: number = board[id22]
          const gapShape22 = this.detectGapContinuousLine(r22, c22, player22, dirType)
          if (gapShape22) {
            const [lftCnt, rhtCnt, countOfFreeSide] = gapShape22
            this.updateGapShapeCountMap(player22, lftCnt, rhtCnt, countOfFreeSide, -1)
          }
        }
      }
    }
  }

  public afterRollback(r: number, c: number, player: number): void {
    const { context, board, dirCountMap } = this
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
          const id2: number = context.idxIfValid(r2, c2)
          if (id2 < 0 || board[id2] !== player) break
          countMap[id2] -= cnt
        }
      }
      for (const dirType of gomokuDirectionTypes) dirCountMap[dirType][id] = 0
    }

    // Update conShapeCountMap.
    for (const dirType of gomokuDirectionTypes) {
      this.updateRelatedConShapeCountMap(r, c, 1, dirType, 1)
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const [r0, c0] = context.move(r, c, revDirType, 1)
      const id0: number = context.idxIfValid(r0, c0)
      const [r2, c2] = context.move(r, c, dirType, 1)
      const id2: number = context.idxIfValid(r2, c2)

      if (id0 >= 0 && id2 >= 0 && board[id0] === board[id2] && board[id0] >= 0) {
        const player0: number = board[id0]
        const [cnt0, countOfFreeSide0] = this.detectFreeSide(r0, c0, revDirType)
        const [cnt2, countOfFreeSide2] = this.detectFreeSide(r2, c2, dirType)
        const countOfFreeSide: number = countOfFreeSide0 + countOfFreeSide2
        this.updateGapShapeCountMap(player0, cnt0, cnt2, countOfFreeSide, 1)
      }

      if (id0 >= 0 && board[id0] >= 0) {
        const player0: number = board[id0]
        const gapShape = this.detectGapContinuousLine(r0, c0, player0, revDirType)
        if (gapShape) {
          const [lftCnt, rhtCnt, countOfFreeSide] = gapShape
          this.updateGapShapeCountMap(player0, lftCnt, rhtCnt, countOfFreeSide, 1)
        }
      }

      if (id2 >= 0 && board[id2] >= 0) {
        const player2: number = board[id2]
        const gapShape = this.detectGapContinuousLine(r2, c2, player2, dirType)
        if (gapShape) {
          const [lftCnt, rhtCnt, countOfFreeSide] = gapShape
          this.updateGapShapeCountMap(player2, lftCnt, rhtCnt, countOfFreeSide, 1)
        }
      }
    }
  }

  public score(currentPlayer: number, scoreForPlayer: number): number {
    if (this.hasReachedTheLimit(scoreForPlayer)) return Number.POSITIVE_INFINITY
    if (this.hasReachedTheLimit(scoreForPlayer ^ 1)) return Number.NEGATIVE_INFINITY

    const { context, conShapeCountMap, gapShapeCountMap, scoreMap } = this
    const conCountMap = conShapeCountMap[scoreForPlayer]
    const gapCountMap = gapShapeCountMap[scoreForPlayer]

    let score = 0
    for (let cnt = 1; cnt < context.MAX_INLINE; ++cnt) {
      const [a, b, c] = conCountMap[cnt]
      const [x, y, z] = scoreMap.continuously[cnt]
      score += a * x + b * y + c * z
    }
    for (let cnt = 1; cnt <= context.MAX_INLINE; ++cnt) {
      const [a, b, c] = gapCountMap[cnt]
      const [x, y, z] = scoreMap.gap[cnt]
      score += a * x + b * y + c * z
    }

    if (currentPlayer === scoreForPlayer) return score

    const buffer: number = Math.random() * context.NEXT_MOVER_BUFFER_FAC
    return score + score * buffer
  }

  // Check if it's endgame.
  public hasReachedTheLimit(player: number): boolean {
    const { context, conShapeCountMap } = this
    return conShapeCountMap[player][context.MAX_INLINE].some(x => x > 0)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public toJSON() {
    const { dirCountMap, conShapeCountMap, gapShapeCountMap } = this
    return { dirCountMap, conShapeCountMap, gapShapeCountMap }
  }

  protected updateRelatedConShapeCountMap(
    centerR: number,
    centerC: number,
    startCnt: number,
    dirType: GomokuDirectionType,
    v: number,
  ): void {
    const { context, board, dirCountMap } = this
    const [dr, dc] = gomokuDirections[dirType]

    let threshold: number = context.MAX_INLINE - startCnt
    let r = centerR + dr * startCnt
    let c = centerC + dc * startCnt
    let player = -1
    if (startCnt > 1) {
      const id: number = context.idx(centerR, centerC)
      if (id >= 0) player = board[id]
    }

    for (; threshold > 0; ) {
      const id: number = context.idxIfValid(r, c)
      if (id < 0) break

      if (board[id] < 0) {
        r += dr
        c += dc
        threshold -= 1
        continue
      }

      if (player >= 0 && player !== board[id]) break

      player = board[id]
      const cnt: number = dirCountMap[dirType][id]
      this.updateConShapeCountMap(player, r, c, cnt, dirType, v)
      r += dr * cnt
      c += dc * cnt
      threshold -= cnt
    }
  }

  protected updateConShapeCountMap(
    player: number,
    startR: number,
    startC: number,
    cnt: number,
    dirType: GomokuDirectionType,
    v: number,
  ): void {
    const countOfFreeSide: number = this.detectExpandable(player, startR, startC, cnt, dirType)
    const normalizedCnt: number = Math.min(cnt, this.context.MAX_INLINE)
    this.conShapeCountMap[player][normalizedCnt][countOfFreeSide] += v
  }

  protected updateGapShapeCountMap(
    player: number,
    lftCnt: number,
    rhtCnt: number,
    countOfFreeSide: number,
    v: number,
  ): void {
    const threshold: number = this.context.MAX_INLINE - 1
    if (lftCnt >= threshold || rhtCnt >= threshold) return

    const cnt: number = lftCnt + rhtCnt
    const _cnt: number = Math.min(cnt, this.context.MAX_INLINE)
    this.gapShapeCountMap[player][_cnt][countOfFreeSide] += v
  }

  protected detectGapContinuousLine(
    r: number,
    c: number,
    player: number,
    dirType: GomokuDirectionType,
  ): [lftCnt: number, rhtCnt: number, countOfFreeSide: number] | null {
    const revDirType: GomokuDirectionType = dirType ^ 1
    const [cnt0, countOfFreeSide0] = this.detectFreeSide(r, c, revDirType)
    const [cnt2, countOfFreeSide2] = this.detectFreeSide(r, c, dirType)

    if (countOfFreeSide2) {
      const { context, board } = this
      const [r22, c22] = context.move(r, c, dirType, cnt2 + 1)
      const id22: number = context.idxIfValid(r22, c22)
      if (id22 >= 0 && board[id22] === player) {
        const [cnt22, countOfFreeSide22] = this.detectFreeSide(r22, c22, dirType)
        const countOfFreeSide: number = countOfFreeSide0 + countOfFreeSide22
        return [cnt0 + cnt2 - 1, cnt22, countOfFreeSide]
      }
    }
    return null
  }

  protected detectFreeSide(
    r: number,
    c: number,
    dirType: GomokuDirectionType,
  ): [cnt: number, countOfFreeSide: 0 | 1] {
    const { context, board, dirCountMap } = this
    const id: number = context.idx(r, c)
    const cnt = dirCountMap[dirType][id]
    const [r2, c2] = context.move(r, c, dirType, cnt)
    const id2 = context.idxIfValid(r2, c2)
    const result = [cnt, id2 >= 0 && board[id2] < 0 ? 1 : 0] as [number, 0 | 1]
    return result
  }

  protected detectExpandable(
    player: number,
    startR: number,
    startC: number,
    cnt: number,
    dirType: number,
  ): number {
    const { context, board } = this
    const { MAX_INLINE } = context
    const revDirType: GomokuDirectionType = dirType ^ 1

    // Left position
    const [r0, c0] = context.move(startR, startC, revDirType, 1)
    const id0: number = context.idxIfValid(r0, c0)
    const isFreeSide0: 0 | 1 = id0 >= 0 && board[id0] < 0 ? 1 : 0

    // Right position
    const [r2, c2] = context.move(startR, startC, dirType, cnt)
    const id2: number = context.idxIfValid(r2, c2)
    const isFreeSide2: 0 | 1 = id2 >= 0 && board[id2] < 0 ? 1 : 0

    const countOfFreeSide: number = isFreeSide0 + isFreeSide2
    if (countOfFreeSide === 0) return 0

    let maxPossibleCnt: number = cnt + countOfFreeSide
    if (maxPossibleCnt < MAX_INLINE) {
      if (isFreeSide0) {
        const [dr, dc] = gomokuDirections[revDirType]
        for (let r = r0, c = c0; maxPossibleCnt < MAX_INLINE; ++maxPossibleCnt) {
          r += dr
          c += dc
          const id: number = context.idxIfValid(r, c)
          if (id < 0 || (board[id] >= 0 && board[id] !== player)) break
        }
      }

      if (isFreeSide2) {
        const [dr, dc] = gomokuDirections[dirType]
        for (let r = r2, c = c2; maxPossibleCnt < MAX_INLINE; ++maxPossibleCnt) {
          r += dr
          c += dc
          const id: number = context.idxIfValid(r, c)
          if (id < 0 || (board[id] >= 0 && board[id] !== player)) break
        }
      }
    }
    return maxPossibleCnt < MAX_INLINE ? 0 : countOfFreeSide
  }

  protected countDangerShapes(player: number): number {
    const { context, conShapeCountMap, gapShapeCountMap } = this
    const shapeCountMap1 = conShapeCountMap[player][context.MAX_INLINE - 1]
    const shapeCountMap2 = gapShapeCountMap[player][context.MAX_INLINE]
    const cnt: number =
      shapeCountMap1[1] +
      shapeCountMap1[2] * 2 +
      shapeCountMap2[0] +
      shapeCountMap2[1] +
      shapeCountMap2[2]
    return cnt
  }
}
