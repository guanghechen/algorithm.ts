import type { IEnhancedFindset } from './types'
import { UnsafeEnhancedFindset } from './unsafe/enhanced'

/**
 * An enhanced findset support to query the set of all nodes on a given tree.
 */
export class EnhancedFindset extends UnsafeEnhancedFindset implements IEnhancedFindset {
  public override init(N: number): void {
    if (!Number.isInteger(N) || N < 1) {
      throw new RangeError(
        `[EnhancedFindset] N is expected to be a positive integer, but got (${N}).`,
      )
    }
    super.init(N)
  }

  public override root(x: number): number {
    if (!Number.isInteger(x) || x < 1 || x > this._N) {
      throw new RangeError(
        `[EnhancedFindset] x is expected to be a positive integer smaller than ${this._N}, but got (${x}).`,
      )
    }
    return super.root(x)
  }
}
