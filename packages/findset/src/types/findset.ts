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

export interface IReadonlyFindset {
  /**
   * Determine whether if the findset has been destroyed.
   */
  readonly destroyed: boolean

  /**
   * The number of elements in the set.
   */
  readonly size: number

  /**
   * Find the root element of x.
   * @param x
   */
  root(x: number): number
}

export interface IFindset extends IReadonlyFindset {
  /**
   * Destroy the findset.
   */
  destroy(): void

  /**
   * Initialize the findset with the N elements.
   * @param N
   */
  init(N: number): void

  /**
   * Merge two tree.
   * @param x
   * @param y
   * @returns the new root
   */
  merge(x: number, y: number): number
}
