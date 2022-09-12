/**
 * 并查集是一个数据结构，用于维护一个森林中的节点关系，可以在均摊常数时间复杂度
 * 下执行下述操作：
 *
 * 1. 判断两个节点是否处于同义棵树中
 * 2. 合并两棵树
 *
 * The find-set is a data structure used to maintain the node relationship in a
 * forest. Find set support to perform the following operations under the
 * amortized constant time complexity:
 *
 * 1. Determine whether two nodes are in a synonymous tree.
 * 2. Merge two trees.
 */
export interface IFindset {
  /**
   * Initialize the findset .
   * @param N
   */
  init(N: number): void
  /**
   * Release space.
   */
  destroy(): void
  /**
   * Find the root element of x.
   * @param x
   */
  root(x: number): number
  /**
   * Merge two tree.
   * @param x
   * @param y
   * @returns the new root
   */
  merge(x: number, y: number): number
}

/**
 * 启发式并查集，在普通并查集的基础上维护了每棵树的节点个数，在合并树时，始终采
 * 用节点数多的那棵的根节点作为新树的根节点，这样可以降低后续查询的执行次数。
 *
 * Heuristic find-set maintains the number of nodes of each tree on the basis
 * of the ordinary version. When merging trees, always use the root node of the
 * tree with more nodes as the root node of the new tree, which can reduce the
 * number of executions of subsequent queries.
 */
export interface IHeuristicFindset extends IFindset {
  /**
   * Get size (the number of the nodes) of the tree which x located.
   * @param x
   */
  count(x: number): number
}

/**
 * Enhanced findset.
 *
 * On the basis of ordinary findset, this enhanced version also supports to get
 * all the nodes on a given tree (access through the root node).
 */
export interface IEnhancedFindset extends IFindset {
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
