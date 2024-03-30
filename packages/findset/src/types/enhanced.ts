/**
 * Enhanced findset.
 *
 * On the basis of ordinary findset, this enhanced version also supports to get
 * all the nodes on a given tree (access through the root node).
 */

import type { IFindset, IReadonlyFindset } from './findset'

export interface IReadonlyEnhancedFindset extends IReadonlyFindset {
  /**
   * Get size (the number of the nodes) of the tree which x located.
   * @param x
   */
  count(x: number): number
  /**
   * Get the set which contains all nodes of the tree which x located.
   * @param x
   */
  getSetOf(x: number): ReadonlySet<number> | undefined
}

export interface IEnhancedFindset extends IReadonlyEnhancedFindset, IFindset {}
