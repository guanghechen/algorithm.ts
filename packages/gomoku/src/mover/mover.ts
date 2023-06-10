import type { IReadonlyCollection } from '@algorithm.ts/types'
import type { IGomokuCandidateState, IGomokuPiece } from '../types/misc'
import type { IGomokuMover } from '../types/mover'
import type { IGomokuMoverContext } from '../types/mover-context'
import type { IGomokuMoverCounter } from '../types/mover-counter'
import type { IGomokuMoverState } from '../types/mover-state'

export interface IGomokuMoverProps {
  context: Readonly<IGomokuMoverContext>
  counter: Readonly<IGomokuMoverCounter>
  state: Readonly<IGomokuMoverState>
}

export class GomokuMover implements IGomokuMover {
  public readonly rootPlayerId: 0 | 1
  protected readonly context: Readonly<IGomokuMoverContext>
  protected readonly counter: Readonly<IGomokuMoverCounter>
  protected readonly state: Readonly<IGomokuMoverState>

  constructor(props: IGomokuMoverProps) {
    this.context = props.context
    this.counter = props.counter
    this.state = props.state
    this.rootPlayerId = 0
  }

  public resetRootPlayerId(rootPlayerId: number): void {
    ;(this.rootPlayerId as number) = rootPlayerId & 1
  }

  public init(pieces: IReadonlyCollection<IGomokuPiece> | ReadonlyArray<IGomokuPiece>): void {
    this.context.init(pieces)
    this.counter.init(pieces)
    this.state.init(pieces)
  }

  public forward(posId: number, playerId: number): void {
    const { context, counter, state } = this
    if (context.board[posId] < 0) {
      context.forward(posId, playerId)
      counter.forward(posId, playerId)
      state.forward(posId, playerId)
    }
  }

  public revert(posId: number): void {
    const { context, counter, state } = this
    if (context.board[posId] >= 0) {
      context.revert(posId)
      counter.revert(posId)
      state.revert(posId)
    }
  }

  public expand(
    nextPlayerId: number,
    candidates: IGomokuCandidateState[],
    candidateGrowthFactor: number,
    MAX_SIZE?: number,
  ): number {
    return this.state.expand(nextPlayerId, candidates, candidateGrowthFactor, MAX_SIZE)
  }

  public topCandidate(nextPlayerId: number): IGomokuCandidateState | undefined {
    return this.state.topCandidate(nextPlayerId)
  }

  public score(nextPlayerId: number): number {
    return this.state.score(nextPlayerId ^ 1, this.rootPlayerId)
  }

  public isFinal(): boolean {
    return this.state.isFinal()
  }

  public couldReachFinal(nextPlayerId: number): boolean {
    return this.counter.mustWinPosSet(nextPlayerId).size > 0
  }
}
