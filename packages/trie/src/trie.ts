import type { ITrie, ITrieNodeData, ITrieOptions, ITrieValue } from './types'

export class Trie<E, V extends ITrieValue> implements ITrie<E, V> {
  protected readonly _SIGMA_SIZE: number
  protected readonly _values: Array<V | undefined>
  protected readonly _ch: Uint32Array[]
  protected readonly _idx: (c: E) => number
  protected readonly _mergeNodeValue: (prevValue: V, nextValue: V) => V
  protected _sz: number
  protected _wordCount: number
  protected _destroyed: boolean

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
    this._destroyed = false
  }

  public get destroyed(): boolean {
    return this._destroyed
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

  public destroy(): void {
    if (this._destroyed) return
    this._destroyed = true

    this._values.length = 0
    this._ch.length = 0
  }

  public init(): void {
    if (this._destroyed) {
      throw new Error('[Trie] `init` is not allowed since it has been destroyed')
    }

    this._sz = 1
    this._wordCount = 0
    this._values[0] = undefined
    this._ch[0].fill(0)
  }

  public set(elements: Iterable<E>, value: V): this {
    let u = 0
    let { _sz } = this
    const { _SIGMA_SIZE, _ch, _values, _idx } = this
    for (const e of elements) {
      const c: number = _idx(e)
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

  public set_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    value: V,
    start: number,
    end: number,
  ): this {
    let u = 0
    let { _sz } = this
    const { _SIGMA_SIZE, _ch, _values, _idx } = this
    for (let i = start; i < end; ++i) {
      const c: number = _idx(elements[i] as E)
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

  public delete(elements: Iterable<E>): boolean {
    let u = 0
    const { _ch, _values, _idx } = this
    for (const e of elements) {
      const c: number = _idx(e)
      const v: number = _ch[u][c]
      if (v === 0) return false
      u = v
    }

    if (_values[u] === undefined) return false

    this._wordCount -= 1
    _values[u] = undefined
    return true
  }

  public delete_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    start: number,
    end: number,
  ): boolean {
    let u = 0
    const { _ch, _values, _idx } = this
    for (let i = start; i < end; ++i) {
      const c: number = _idx(elements[i] as E)
      const v: number = _ch[u][c]
      if (v === 0) return false
      u = v
    }

    if (_values[u] === undefined) return false

    this._wordCount -= 1
    _values[u] = undefined
    return true
  }

  public get(elements: Iterable<E>): V | undefined {
    let u = 0
    const { _ch, _values, _idx } = this
    for (const e of elements) {
      const c: number = _idx(e)
      const v: number = _ch[u][c]
      if (v === 0) return undefined
      u = v
    }
    return _values[u]
  }

  public get_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    start: number,
    end: number,
  ): V | undefined {
    let u = 0
    const { _ch, _values, _idx } = this
    for (let i = start; i < end; ++i) {
      const c: number = _idx(elements[i] as E)
      const v: number = _ch[u][c]
      if (v === 0) return undefined
      u = v
    }
    return _values[u]
  }

  public has(elements: Iterable<E>): boolean {
    return this.get(elements) !== undefined
  }

  public has_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    start: number,
    end: number,
  ): boolean {
    return this.get_advance(elements, start, end) !== undefined
  }

  public hasPrefix(elements: Iterable<E>): boolean {
    const { _ch, _idx } = this

    let u: number = 0
    let isEmpty: boolean = true
    for (const e of elements) {
      const c: number = _idx(e)
      u = _ch[u][c]
      isEmpty = false
      if (u === 0) return false
    }
    return isEmpty ? this._wordCount > 0 : true
  }

  public hasPrefix_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    start: number,
    end: number,
  ): boolean {
    if (start >= end) return this._wordCount > 0

    const { _ch, _idx } = this
    for (let i = start, u = 0; i < end; ++i) {
      const c: number = _idx(elements[i] as E)
      u = _ch[u][c]
      if (u === 0) return false
    }
    return true
  }

  public *findAll(elements: Iterable<E>): IterableIterator<ITrieNodeData<V>> {
    const { _ch, _values, _idx } = this

    let u: number = 0
    let i: number = 0
    for (const e of elements) {
      const c: number = _idx(e)
      u = _ch[u][c]
      i += 1
      if (u === 0) break
      if (_values[u] !== undefined) yield { end: i, val: _values[u]! }
    }

    if (i === 0) {
      const val = this._values[0]
      if (val !== undefined) yield { end: 0, val }
      return
    }
  }

  public *findAll_advance(
    elements: E extends string ? string : ReadonlyArray<E>,
    start: number,
    end: number,
  ): IterableIterator<ITrieNodeData<V>> {
    if (start >= end) {
      const val = this._values[0]
      if (val !== undefined) yield { end: start, val }
      return
    }

    const { _ch, _values, _idx } = this
    for (let i = start, u = 0; i < end; ++i) {
      const c: number = _idx(elements[i] as E)
      u = _ch[u][c]
      if (u === 0) break
      if (_values[u] !== undefined) yield { end: i + 1, val: _values[u]! }
    }
  }
}
