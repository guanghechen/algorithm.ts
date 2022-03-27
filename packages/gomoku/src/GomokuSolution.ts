import { GomokuContext } from './GomokuContext'
import { GomokuState } from './GomokuState'
import { GomokuStateCompressor } from './GomokuStateCompressor'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'
import { createScoreMap } from './util'

export class GomokuSolution {
  protected readonly MAX_DEPTH: number
  protected readonly context: GomokuContext
  protected readonly state: GomokuState
  protected readonly stateCompressor: GomokuStateCompressor
  protected readonly stateCache: Map<bigint, number>
  protected scoreForPlayer: number
  protected bestMoveId: number | null

  constructor(
    MAX_ROW: number,
    MAX_COL: number,
    MAX_INLINE = 5,
    MAX_DEPTH = 3,
    MAX_NEXT_MOVER_BUFFER?: number,
    scoreMap?: IScoreMap,
  ) {
    const context = new GomokuContext(MAX_ROW, MAX_COL, MAX_INLINE, MAX_NEXT_MOVER_BUFFER)
    const _scoreMap: IScoreMap = scoreMap ?? createScoreMap(context.MAX_INLINE)

    this.MAX_DEPTH = Math.max(1, Math.round(MAX_DEPTH))
    this.context = context
    this.state = new GomokuState(context, _scoreMap)
    this.stateCompressor = new GomokuStateCompressor(BigInt(context.TOTAL_POS))
    this.stateCache = new Map()
    this.scoreForPlayer = -1
    this.bestMoveId = null
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.state.init(pieces)
    this.stateCache.clear()
  }

  public forward(r: number, c: number, p: number): void {
    const id: number = this.context.idx(r, c)
    this.state.forward(id, p)
  }

  public rollback(r: number, c: number): void {
    const id: number = this.context.idx(r, c)
    this.state.rollback(id)
  }

  public minimaxSearch(currentPlayer: number): [r: number, c: number] {
    if (this.state.isFinal()) return [-1, -1]

    this.stateCache.clear()
    this.scoreForPlayer = currentPlayer
    this.bestMoveId = null

    this.context.reRandNextMoverBuffer()
    this.alphaBeta(
      currentPlayer,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      0,
      this.stateCompressor.INITIAL_STATE,
      this.state.score(currentPlayer ^ 1, currentPlayer),
    )

    /* istanbul ignore next */
    if (!this.bestMoveId) return [-1, -1]
    const [r, c] = this.context.revIdx(this.bestMoveId)
    return [r, c]
  }

  protected alphaBeta(
    player: number,
    alpha: number,
    beta: number,
    cur: number,
    prevState: bigint,
    stateScore: number,
  ): number {
    const { state, stateCompressor, stateCache, scoreForPlayer } = this
    if (cur === this.MAX_DEPTH || state.isFinal()) return stateScore

    const candidates: IGomokuCandidateState[] = state.expand(player, scoreForPlayer)
    if (player === scoreForPlayer) {
      // Higher score items common first.
      candidates.sort((x, y) => y.score - x.score)
    } else {
      // Lower score items common first.
      candidates.sort((x, y) => x.score - y.score)
    }

    if (cur === 0) this.bestMoveId = candidates[0].id
    for (const { id, score } of candidates) {
      const nextState: bigint = stateCompressor.compress(cur, prevState, BigInt(id))
      let gamma = stateCache.get(nextState)
      if (gamma === undefined) {
        state.forward(id, player)
        gamma = this.alphaBeta(player ^ 1, alpha, beta, cur + 1, nextState, stateScore + score)
        state.rollback(id)
        stateCache.set(nextState, gamma)
      }

      if (player === scoreForPlayer) {
        if (alpha < gamma) {
          // eslint-disable-next-line no-param-reassign
          alpha = gamma
          // Update answer.
          if (cur === 0) this.bestMoveId = id
        }
      } else {
        if (beta > gamma) {
          // eslint-disable-next-line no-param-reassign
          beta = gamma
        }
      }
      if (beta <= alpha) break
    }

    return player === scoreForPlayer ? alpha : beta
  }
}
