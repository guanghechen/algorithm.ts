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
    context.traverseAllDirections((id, dirType) => {
      const player: number = board[id]
      if (player >= 0) {
        const id2: number = context.safeMoveOneStep(id, dirType)
        const countMap = dirCountMap[dirType]
        countMap[id] = id2 >= 0 && board[id2] === player ? countMap[id2] + 1 : 1
      }
    })

    // Initialize conShapeCountMap.
    context.traverseLeftDirections((id, dirType) => {
      const player: number = board[id]
      if (player >= 0 && dirCountMap[dirType][id] === 1) {
        const revDirType: GomokuDirectionType = dirType ^ 1
        this.updateConShapeCountMap(id, revDirType, 1)
      }
    })

    // Initialize gapShapeCountMap.
    context.traverseLeftDirections((id, dirType) => {
      const revDirType: GomokuDirectionType = dirType ^ 1
      if (board[id] < 0) {
        const id0: number = context.safeMoveOneStep(id, revDirType)
        if (id0 < 0 || board[id0] < 0) return

        const player: number = board[id0]
        const id2: number = context.safeMoveOneStep(id, dirType)
        if (id2 < 0 || board[id2] !== player) return

        const lftCnt: number = dirCountMap[revDirType][id0]
        const rhtCnt: number = dirCountMap[dirType][id2]
        const startId: number = context.fastMove(id, revDirType, lftCnt)
        this.updateGapShapeCountMap(player, startId, lftCnt, rhtCnt, dirType, 1)
      }
    })
  }

  public beforeForward(id: number): void {
    // Update conShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      this.updateRelatedConShapeCountMap(id, dirType, -1)
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      this.updateRelatedGapShapeCountMap(id, dirType, -1)
    }
  }

  public afterForward(id: number): void {
    const { context, board, dirCountMap } = this
    const player: number = board[id]

    // Update dirCountMap.
    {
      for (const dirType of gomokuDirectionTypes) {
        const id2: number = context.safeMoveOneStep(id, dirType)
        const countMap = dirCountMap[dirType]
        countMap[id] = id2 >= 0 && board[id2] === player ? countMap[id2] + 1 : 1
      }

      for (const dirType of gomokuDirectionTypes) {
        const revDirType = dirType ^ 1
        const countMap = dirCountMap[dirType]
        const cnt: number = countMap[id]
        for (let id2: number = id; ; ) {
          id2 = context.safeMoveOneStep(id2, revDirType)
          if (board[id2] !== player) break
          countMap[id2] += cnt
        }
      }
    }

    // Update conShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      this.updateRelatedConShapeCountMap(id, dirType, 1)
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      this.updateRelatedGapShapeCountMap(id, dirType, 1)
    }
  }

  public beforeRollback(id: number): void {
    // Update conShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      this.updateRelatedConShapeCountMap(id, dirType, -1)
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      this.updateRelatedGapShapeCountMap(id, dirType, -1)
    }
  }

  public afterRollback(id: number, player: number): void {
    const { context, board, dirCountMap } = this

    // Update dirCountMap.
    {
      for (const dirType of gomokuDirectionTypes) {
        const revDirType = dirType ^ 1
        const countMap = dirCountMap[dirType]
        const cnt: number = countMap[id]
        for (let id2: number = id; ; ) {
          id2 = context.safeMoveOneStep(id2, revDirType)
          if (board[id2] !== player) break
          countMap[id2] -= cnt
        }
      }
      for (const dirType of gomokuDirectionTypes) dirCountMap[dirType][id] = 0
    }

    // Update conShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      this.updateRelatedConShapeCountMap(id, dirType, 1)
    }

    // Update gapShapeCountMap.
    for (const dirType of leftHalfGomokuDirectionTypes) {
      this.updateRelatedGapShapeCountMap(id, dirType, 1)
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

    const buffer: number = Math.random() * context.NEXT_MOVER_MAX_BUFFER
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
    centerId: number,
    dirType: GomokuDirectionType,
    v: number,
  ): void {
    const revDirType = dirType ^ 1
    const { context, board, dirCountMap } = this
    const lftMaxMovableStep: number = Math.min(
      context.MAX_INLINE - 1,
      context.maxMovableSteps(centerId, revDirType),
    )
    const rhtMaxMovableStep: number = Math.min(
      context.MAX_INLINE - 1,
      context.maxMovableSteps(centerId, dirType),
    )
    const THRESHOLD: number = lftMaxMovableStep + rhtMaxMovableStep + 1

    let steps = 0
    let id: number = context.fastMove(centerId, revDirType, lftMaxMovableStep)
    for (; steps < THRESHOLD; ) {
      if (board[id] < 0) {
        steps += 1
        id = context.fastMoveOneStep(id, dirType)
        continue
      }

      const rhtCnt: number = dirCountMap[dirType][id]
      if (steps === 0) {
        const rhtCnt: number = dirCountMap[dirType][id]
        const id2: number = context.fastMove(id, dirType, rhtCnt - 1)
        this.updateConShapeCountMap(id2, revDirType, v)
      } else {
        this.updateConShapeCountMap(id, dirType, v)
      }

      id = context.fastMove(id, dirType, rhtCnt)
      steps += rhtCnt
    }
  }

  protected updateConShapeCountMap(startId: number, dirType: GomokuDirectionType, v: number): void {
    const player: number = this.board[startId]
    const cnt: number = this.dirCountMap[dirType][startId]
    const countOfFreeSide: number = this.countFreeSide(player, startId, cnt, dirType)
    const normalizedCnt: number = Math.min(cnt, this.context.MAX_INLINE)
    this.conShapeCountMap[player][normalizedCnt][countOfFreeSide] += v
  }

  protected updateRelatedGapShapeCountMap(centerId: number, dirType: number, v: number): void {
    const revDirType = dirType ^ 1
    const { context, board, dirCountMap } = this
    const lftMaxMovableStep: number = Math.min(
      context.MAX_INLINE - 1,
      context.maxMovableSteps(centerId, revDirType),
    )
    const rhtMaxMovableStep: number = Math.min(
      context.MAX_INLINE - 1,
      context.maxMovableSteps(centerId, dirType),
    )
    const THRESHOLD: number = lftMaxMovableStep + rhtMaxMovableStep + 1

    let steps = 0
    let id: number = context.fastMove(centerId, revDirType, lftMaxMovableStep)
    for (; steps < THRESHOLD; steps += 1, id = context.fastMoveOneStep(id, dirType)) {
      if (board[id] < 0) continue

      const lftCnt: number = dirCountMap[revDirType][id]
      if (steps < 2) {
        const rhtCnt: number = dirCountMap[dirType][id]
        const id2: number = context.fastMove(id, dirType, rhtCnt - 1)
        this.detectGapShape(id2, revDirType, v)
      }
      id = context.fastMove(id, revDirType, lftCnt - 1)
      steps -= lftCnt - 1
      break
    }

    for (; steps < THRESHOLD; ) {
      if (board[id] < 0) {
        id = context.fastMoveOneStep(id, dirType)
        steps += 1
        continue
      }

      this.detectGapShape(id, dirType, v)
      const rhtCnt: number = dirCountMap[dirType][id]
      id = context.fastMove(id, dirType, rhtCnt)
      steps += rhtCnt
    }
  }

  protected detectGapShape(id: number, dirType: number, v: number): void {
    const { context, board, dirCountMap } = this
    const lftCnt: number = dirCountMap[dirType][id]

    const id1: number = context.safeMove(id, dirType, lftCnt)
    if (id1 < 0 || board[id1] >= 0) return

    const player = board[id]
    const id2: number = context.safeMove(id1, dirType, 1)
    if (id2 < 0 || board[id2] !== player) return
    const rhtCnt: number = dirCountMap[dirType][id2]
    this.updateGapShapeCountMap(player, id, lftCnt, rhtCnt, dirType, v)
  }

  protected updateGapShapeCountMap(
    player: number,
    startId: number,
    lftCnt: number,
    rhtCnt: number,
    dirType: GomokuDirectionType,
    v: number,
  ): void {
    const threshold: number = this.context.MAX_INLINE - 1
    if (lftCnt >= threshold || rhtCnt >= threshold) return

    const cnt: number = lftCnt + rhtCnt + 1
    const countOfFreeSide: number = this.countFreeSide(player, startId, cnt, dirType)
    const normalizedCnt: number = Math.min(lftCnt + rhtCnt, this.context.MAX_INLINE)
    this.gapShapeCountMap[player][normalizedCnt][countOfFreeSide] += v
  }

  protected countFreeSide(player: number, startId: number, cnt: number, dirType: number): number {
    const { context, board } = this
    const { MAX_INLINE } = context

    // Left position
    const revDirType: GomokuDirectionType = dirType ^ 1
    const id0: number = context.safeMoveOneStep(startId, revDirType)
    const isFreeSide0: 0 | 1 = id0 >= 0 && board[id0] < 0 ? 1 : 0

    // Right position
    const id2: number = context.safeMove(startId, dirType, cnt)
    const isFreeSide2: 0 | 1 = id2 >= 0 && board[id2] < 0 ? 1 : 0

    const countOfFreeSide: number = isFreeSide0 + isFreeSide2
    if (countOfFreeSide === 0) return 0

    let maxPossibleCnt: number = cnt + countOfFreeSide
    if (maxPossibleCnt < MAX_INLINE) {
      if (isFreeSide0) {
        for (let id = id0; maxPossibleCnt < MAX_INLINE; ++maxPossibleCnt) {
          id = context.safeMoveOneStep(id, revDirType)
          if (id < 0 || (board[id] >= 0 && board[id] !== player)) break
        }
      }

      if (isFreeSide2) {
        for (let id = id2; maxPossibleCnt < MAX_INLINE; ++maxPossibleCnt) {
          id = context.safeMoveOneStep(id, dirType)
          if (id < 0 || (board[id] >= 0 && board[id] !== player)) break
        }
      }
    }
    return maxPossibleCnt < MAX_INLINE ? 0 : countOfFreeSide
  }
}
