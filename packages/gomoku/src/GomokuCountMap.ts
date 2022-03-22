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

        const lftCnt: number = dirCountMap[revDirType][id0]
        const rhtCnt: number = dirCountMap[dirType][id2]
        const [startR, startC] = context.move(r, c, revDirType, lftCnt)
        this.updateGapShapeCountMap(player, startR, startC, lftCnt, rhtCnt, dirType, 1)
      }
    })
  }

  public beforeForward(r: number, c: number): void {
    // Update conShapeCountMap.
    for (const dirType of gomokuDirectionTypes) {
      this.updateRelatedConShapeCountMap(r, c, 1, dirType, -1)
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      this.updateRelatedGapShapeCountMap(r, c, dirType, -1)
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
      this.updateRelatedGapShapeCountMap(r, c, dirType, 1)
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
      this.updateRelatedGapShapeCountMap(r, c, dirType, -1)
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
      this.updateRelatedGapShapeCountMap(r, c, dirType, 1)
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
    distanceToCenterPos: number,
    dirType: GomokuDirectionType,
    v: number,
  ): void {
    const { context, board, dirCountMap } = this
    const [dr, dc] = gomokuDirections[dirType]

    let threshold: number = context.MAX_INLINE - distanceToCenterPos
    let r = centerR + dr * distanceToCenterPos
    let c = centerC + dc * distanceToCenterPos
    let player = -1
    if (distanceToCenterPos > 1) {
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
    const countOfFreeSide: number = this.countFreeSide(player, startR, startC, cnt, dirType)
    const normalizedCnt: number = Math.min(cnt, this.context.MAX_INLINE)
    this.conShapeCountMap[player][normalizedCnt][countOfFreeSide] += v
  }

  protected updateRelatedGapShapeCountMap(
    centerR: number,
    centerC: number,
    dirType: number,
    v: number,
  ): void {
    const { context, board, dirCountMap } = this
    const revDirType = dirType ^ 1

    const [dr, dc] = gomokuDirections[dirType]
    let r: number = centerR - dr * context.MAX_INLINE
    let c: number = centerC - dc * context.MAX_INLINE
    const THRESHOLD: number = context.MAX_INLINE * 2 + 1
    let steps = 0

    // Find leftest valid pos.
    for (; context.isInvalidPos(r, c); r += dr, c += dc) steps += 1

    // Find leftest placed pos.
    for (; steps < THRESHOLD; r += dr, c += dc, steps += 1) {
      const id: number = context.idxIfValid(r, c)
      if (id < 0) return

      const player: number = board[id]
      if (player < 0) continue

      const lftCnt: number = dirCountMap[revDirType][id]
      const rhtCnt: number = dirCountMap[dirType][id]

      if (steps < 2) {
        const [r2, c2] = context.move(r, c, dirType, rhtCnt - 1)
        this.detectGapShape(r2, c2, revDirType, v)
      }

      r -= dr * (lftCnt - 1)
      c -= dc * (lftCnt - 1)
      steps -= lftCnt - 1
      break
    }

    for (; steps < THRESHOLD; ) {
      const id: number = context.idx(r, c)
      if (id < 0) return

      const player: number = board[id]
      if (player < 0) {
        r += dr
        c += dc
        steps += 1
        continue
      }

      if (player >= 0) {
        this.detectGapShape(r, c, dirType, v)

        const rhtCnt: number = dirCountMap[dirType][id]
        r += dr * rhtCnt
        c += dc * rhtCnt
        steps += rhtCnt
      }
    }
  }

  protected detectGapShape(r: number, c: number, dirType: number, v: number): void {
    const { context, board, dirCountMap } = this
    const id: number = context.idx(r, c)
    const lftCnt: number = dirCountMap[dirType][id]

    const [r1, c1] = context.move(r, c, dirType, lftCnt)
    const id1: number = context.idxIfValid(r1, c1)
    if (id1 < 0 || board[id1] >= 0) return

    const player = board[id]
    const [r2, c2] = context.move(r1, c1, dirType, 1)
    const id2: number = context.idxIfValid(r2, c2)
    if (id2 < 0 || board[id2] !== player) return
    const rhtCnt: number = dirCountMap[dirType][id2]
    this.updateGapShapeCountMap(player, r, c, lftCnt, rhtCnt, dirType, v)
  }

  protected updateGapShapeCountMap(
    player: number,
    startR: number,
    startC: number,
    lftCnt: number,
    rhtCnt: number,
    dirType: GomokuDirectionType,
    v: number,
  ): void {
    const threshold: number = this.context.MAX_INLINE - 1
    if (lftCnt >= threshold || rhtCnt >= threshold) return

    const countOfFreeSide: number = this.countFreeSide(
      player,
      startR,
      startC,
      lftCnt + rhtCnt + 1,
      dirType,
    )
    const normalizedCnt: number = Math.min(lftCnt + rhtCnt, this.context.MAX_INLINE)
    this.gapShapeCountMap[player][normalizedCnt][countOfFreeSide] += v
  }

  protected countFreeSide(
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
}
