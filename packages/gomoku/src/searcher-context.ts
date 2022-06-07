import type { IGomokuContext } from './types/context'
import type { IGomokuCountMap } from './types/count-map'
import type { IGomokuCandidateState } from './types/misc'
import type { IGomokuSearcherContext } from './types/searcher-context'
import type { IGomokuState } from './types/state'

export interface IGomokuSearcherContextProps {
  readonly rootPlayerId: number
  readonly context: Readonly<IGomokuContext>
  readonly countMap: Readonly<IGomokuCountMap>
  readonly state: Readonly<IGomokuState>
}

export class GomokuSearcherContext implements IGomokuSearcherContext {
  public readonly rootPlayerId: number
  public readonly context: Readonly<IGomokuContext>
  public readonly countMap: Readonly<IGomokuCountMap>
  public readonly state: Readonly<IGomokuState>

  constructor(props: IGomokuSearcherContextProps) {
    this.rootPlayerId = props.rootPlayerId
    this.context = props.context
    this.countMap = props.countMap
    this.state = props.state
  }

  public init(rootPlayerId: number): void {
    if (this.rootPlayerId !== rootPlayerId) {
      ;(this.rootPlayerId as number) = rootPlayerId
    }
  }

  public forward(posId: number, playerId: number): void {
    if (this.context.forward(posId, playerId)) {
      this.countMap.forward(posId)
      this.state.forward(posId)
    }
  }

  public revert(posId: number): void {
    if (this.context.revert(posId)) {
      this.countMap.revert(posId)
      this.state.revert(posId)
    }
  }

  public expand(
    nextPlayerId: number,
    candidates: IGomokuCandidateState[],
    minMultipleOfTopScore: number,
    MAX_SIZE?: number,
  ): number {
    return this.state.expand(nextPlayerId, candidates, minMultipleOfTopScore, MAX_SIZE)
  }

  public topCandidate(nextPlayerId: number): IGomokuCandidateState | undefined {
    return this.state.topCandidate(nextPlayerId)
  }

  public score(nextPlayerId: number): number {
    return this.state.score(nextPlayerId ^ 1, this.rootPlayerId)
  }

  public couldReachFinal(nextPlayerId: number): boolean {
    return this.countMap.mustWinPosSet(nextPlayerId).size > 0
  }
}
