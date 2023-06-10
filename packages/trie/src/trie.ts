/* eslint-disable no-param-reassign */
import { UnsafeTrie } from './trie-unsafe'
import type { ITrie, ITrieNodeData } from './types'

export class Trie<E extends unknown[] | string, V> extends UnsafeTrie<E, V> implements ITrie<E, V> {
  public override set(
    element: Readonly<E>,
    value: V,
    start = 0,
    end: number = element.length,
  ): this {
    if (start < 0) start = 0
    if (end > element.length) end = element.length
    return super.set(element, value, start, end)
  }

  public override delete(element: Readonly<E>, start = 0, end: number = element.length): boolean {
    if (start < 0) start = 0
    if (end > element.length) end = element.length
    return super.delete(element, start, end)
  }

  public override get(
    element: Readonly<E>,
    start = 0,
    end: number = element.length,
  ): V | undefined {
    if (start < 0) start = 0
    if (end > element.length) end = element.length
    return super.get(element, start, end)
  }

  public override has(element: Readonly<E>, start = 0, end: number = element.length): boolean {
    if (start < 0) start = 0
    if (end > element.length) end = element.length

    if (start >= end) return super.has(element, 0, 0)
    return super.has(element, start, end)
  }

  public override hasPrefix(prefix: Readonly<E>, start = 0, end: number = prefix.length): boolean {
    if (start < 0) start = 0
    if (end > prefix.length) end = prefix.length
    return super.hasPrefix(prefix, start, end)
  }

  public override find(
    element: Readonly<E>,
    start = 0,
    end: number = element.length,
  ): ITrieNodeData<V> | undefined {
    if (start < 0) start = 0
    if (end > element.length) end = element.length
    return super.find(element, start, end)
  }

  public override findAll(
    element: Readonly<E>,
    start = 0,
    end: number = element.length,
  ): IterableIterator<ITrieNodeData<V>> {
    if (start < 0) start = 0
    if (end > element.length) end = element.length
    return super.findAll(element, start, end)
  }
}
