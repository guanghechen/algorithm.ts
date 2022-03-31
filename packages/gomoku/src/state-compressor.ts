export class GomokuStateCompressor {
  public readonly MOVE_STEP_BIT_BASE: bigint
  public readonly MOVE_STEP_MASK: bigint
  public readonly MOVE_STEP_MINIMUM_FLAG: bigint
  public readonly INITIAL_STATE = 1n

  constructor(TOTAL_POS: bigint) {
    let COMPRESS_MOVE_BIT_BASE = 1n
    while (1n << COMPRESS_MOVE_BIT_BASE < TOTAL_POS) COMPRESS_MOVE_BIT_BASE += 1n

    this.MOVE_STEP_BIT_BASE = COMPRESS_MOVE_BIT_BASE
    this.MOVE_STEP_MASK = (1n << COMPRESS_MOVE_BIT_BASE) - 1n
    this.MOVE_STEP_MINIMUM_FLAG = 1n << COMPRESS_MOVE_BIT_BASE
  }

  public compress(countInState: number, state: bigint, newMoveStepId: bigint): bigint {
    if (countInState === 0) return newMoveStepId + this.MOVE_STEP_MINIMUM_FLAG
    if (countInState === 1) return (state << this.MOVE_STEP_BIT_BASE) | newMoveStepId

    const rhtCnt: number = countInState >> 1
    const RIGHT_BITS: bigint = this.MOVE_STEP_BIT_BASE * BigInt(rhtCnt)
    const rht: bigint = state & ((1n << RIGHT_BITS) - 1n)

    if (countInState & 1) {
      const rhtMoveIds: bigint[] = this.decompressMoveIds(rhtCnt, rht, newMoveStepId)
      const newRht: bigint = this.compressMoveIds(rhtMoveIds)
      return ((state ^ rht) << this.MOVE_STEP_BIT_BASE) | newRht
    } else {
      const lftCnt = countInState - rhtCnt
      const lft: bigint = state >> RIGHT_BITS
      const lftMoveIds: bigint[] = this.decompressMoveIds(lftCnt, lft, newMoveStepId)
      const NEW_LEFT_BITS: bigint = this.MOVE_STEP_BIT_BASE * BigInt(lftCnt + 1)
      const newLft: bigint = this.compressMoveIds(lftMoveIds) | (1n << NEW_LEFT_BITS)
      return (newLft << RIGHT_BITS) | rht
    }
  }

  protected decompressMoveIds(cnt: number, state: bigint, newMoveStepId: bigint): bigint[] {
    const { MOVE_STEP_BIT_BASE, MOVE_STEP_MASK } = this
    const moveIds: bigint[] = []

    let i = 0
    let v = state
    let id = 0n
    for (; i < cnt; ++i) {
      id = v & MOVE_STEP_MASK
      v >>= MOVE_STEP_BIT_BASE
      if (id < newMoveStepId) break
      moveIds.push(id)
    }
    moveIds.push(newMoveStepId)
    if (i < cnt) moveIds.push(id)

    for (i += 1; i < cnt; ++i) {
      id = v & MOVE_STEP_MASK
      v >>= MOVE_STEP_BIT_BASE
      moveIds.push(id)
    }
    return moveIds.reverse()
  }

  protected compressMoveIds(moveIds: bigint[]): bigint {
    const { MOVE_STEP_BIT_BASE } = this
    let result = 0n
    for (const id of moveIds) {
      result = (result << MOVE_STEP_BIT_BASE) | id
    }
    return result
  }
}
