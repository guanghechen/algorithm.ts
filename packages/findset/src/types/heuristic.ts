/**
 * 启发式并查集，在普通并查集的基础上维护了每棵树的节点个数，在合并树时，始终采
 * 用节点数多的那棵的根节点作为新树的根节点，这样可以降低后续查询的执行次数。
 *
 * Heuristic find-set maintains the number of nodes of each tree on the basis
 * of the ordinary version. When merging trees, always use the root node of the
 * tree with more nodes as the root node of the new tree, which can reduce the
 * number of executions of subsequent queries.
 */

import type { IFindset, IReadonlyFindset } from './findset'

export interface IReadonlyHeuristicFindset extends IReadonlyFindset {
  /**
   * Get size (the number of the nodes) of the tree which x located.
   * @param x
   */
  count(x: number): number
}

export interface IHeuristicFindset extends IReadonlyHeuristicFindset, IFindset {}
