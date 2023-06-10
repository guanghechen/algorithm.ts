import type { ITrie, ITrieNodeData, ITrieOptions } from './types'

export class UnsafeTrie<E extends unknown[] | string, V> implements ITrie<E, V> {
  protected readonly _SIGMA_SIZE: number
  protected readonly _values: Array<V | undefined>
  protected readonly _ch: Uint32Array[]
  protected readonly _idx: (c: E[number]) => number
  protected readonly _mergeNodeValue: (prevValue: V, nextValue: V) => V
  protected _sz: number
  protected _wordCount: number

  constructor(props: ITrieOptions<E, V>) {
    const { SIGMA_SIZE, idx, mergeNodeValue } = props
    if (!Number.isInteger(SIGMA_SIZE) || SIGMA_SIZE < 1) {
      throw new RangeError(
        `[Trie] SIGMA_SIZE is expected to be a positive integer, but got (${SIGMA_SIZE}).`,
      )
    }

    this._SIGMA_SIZE = SIGMA_SIZE
    this._idx = idx
    this._mergeNodeValue = mergeNodeValue

    this._values = [undefined]
    this._ch = [new Uint32Array(SIGMA_SIZE)]
    this._sz = 1
    this._wordCount = 0
  }

  public get size(): number {
    return this._wordCount
  }

  public *[Symbol.iterator](): IterableIterator<V> {
    const vStack: number[] = [0]
    const iStack: number[] = [0]
    const { _SIGMA_SIZE, _ch, _values } = this

    for (let h = 0; h >= 0; ) {
      const o = vStack[h]
      const nodes = _ch[o]
      let i = iStack[h]
      while (i < _SIGMA_SIZE && nodes[i] === 0) ++i

      if (i < _SIGMA_SIZE) {
        const u = nodes[i]
        const v = _values[u]
        if (v !== undefined) yield v

        iStack[h] = i + 1
        ++h
        vStack[h] = u
        iStack[h] = 0
      } else {
        --h
      }
    }
  }

  public clear(): void {
    this._sz = 1
    this._wordCount = 0
    this._ch[0].fill(0)
  }

  public destroy(): void {
    this._sz = 0
    this._wordCount = 0
    ;(this._ch as unknown) = undefined
    ;(this._values as unknown) = undefined
  }

  public set(element: Readonly<E>, value: V, start = 0, end: number = element.length): this {
    let u = 0
    let { _sz } = this
    const { _SIGMA_SIZE, _ch, _values, _idx } = this
    for (let i = start; i < end; ++i) {
      const c: number = _idx(element[i])
      if (_ch[u][c] === 0) {
        if (_ch[_sz] === undefined) _ch[_sz] = new Uint32Array(_SIGMA_SIZE)
        else _ch[_sz].fill(0)

        _values[_sz] = undefined
        _ch[u][c] = _sz++
      }
      u = _ch[u][c]
    }

    if (_values[u] === undefined) {
      _values[u] = value
      this._wordCount += 1
    } else {
      const nextValue = this._mergeNodeValue(_values[u]!, value)
      _values[u] = nextValue
    }

    this._sz = _sz
    return this
  }

  public delete(element: Readonly<E>, start = 0, end: number = element.length): boolean {
    let u = 0
    const { _ch, _values, _idx } = this
    for (let i = start; i < end; ++i) {
      const c: number = _idx(element[i])
      const v: number = _ch[u][c]
      if (v === 0) return false
      u = v
    }

    if (_values[u] === undefined) return false

    this._wordCount -= 1
    _values[u] = undefined
    return true
  }

  public get(element: Readonly<E>, start = 0, end: number = element.length): V | undefined {
    let u = 0
    const { _ch, _values, _idx } = this
    for (let i = start; i < end; ++i) {
      const c: number = _idx(element[i])
      const v: number = _ch[u][c]
      if (v === 0) return undefined
      u = v
    }
    return _values[u]
  }

  public has(element: Readonly<E>, start = 0, end: number = element.length): boolean {
    return this.get(element, start, end) !== undefined
  }

  public hasPrefix(element: Readonly<E>, start = 0, end: number = element.length): boolean {
    if (start >= end) return this._wordCount > 0

    const { _ch, _idx } = this
    for (let i = start, u = 0; i < end; ++i) {
      const c: number = _idx(element[i])
      u = _ch[u][c]
      if (u === 0) return false
    }
    return true
  }

  public find(
    element: Readonly<E>,
    start = 0,
    end: number = element.length,
  ): ITrieNodeData<V> | undefined {
    if (start >= end) {
      const val = this._values[0]
      return val === undefined ? undefined : { end: start, val }
    }

    const { _ch, _values, _idx } = this
    for (let i = start, u = 0; i < end; ++i) {
      const c: number = _idx(element[i])
      u = _ch[u][c]
      if (u === 0) break
      if (_values[u] !== undefined) return { end: i + 1, val: _values[u]! }
    }
    return undefined
  }

  public *findAll(
    element: Readonly<E>,
    start = 0,
    end: number = element.length,
  ): IterableIterator<ITrieNodeData<V>> {
    if (start >= end) {
      const val = this._values[0]
      if (val !== undefined) yield { end: start, val }
      return
    }

    const { _ch, _values, _idx } = this
    for (let i = start, u = 0; i < end; ++i) {
      const c: number = _idx(element[i])
      u = _ch[u][c]
      if (u === 0) break
      if (_values[u] !== undefined) yield { end: i + 1, val: _values[u]! }
    }
  }
}
