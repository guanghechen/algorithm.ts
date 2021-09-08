import type { Trie } from '../src'
import { createTrie, digitIdx, lowercaseIdx, uppercaseIdx } from '../src'

describe('trie', function () {
  describe('basic', function () {
    const trie: Trie = createTrie({
      SIGMA_SIZE: 62,
      ZERO: 0,
      idx: (c: string): number => {
        if (/\d/.test(c)) return digitIdx(c) // digits
        if (/[A-Z]/.test(c)) return uppercaseIdx(c) + 10 // uppercase letters
        if (/[a-z]/.test(c)) return lowercaseIdx(c) + 36 // lowercase letters
        throw new TypeError(`Bad character: (${c})`)
      },
      mergeAdditionalValues: (x, y) => x + y,
    })

    test('match', function () {
      trie.init()
      trie.insert('cat', 1)
      trie.insert('cat2', 2)

      expect(trie.match('cat')).toBe(1)
      // expect(trie.match('cat2')).toBe(2)
      expect(trie.match('cat2', 0, 3)).toBe(1)
      expect(trie.match('cat3')).toBe(null)
    })

    test('findAll', function () {
      trie.init()
      trie.insert('ban', 2)
      trie.insert('banana', 1)
      trie.insert('apple', 3)

      expect(trie.find('ban')).toEqual({ end: 3, val: 2 })
      expect(trie.find('bana')).toEqual({ end: 3, val: 2 })
      expect(trie.find('banana')).toEqual({ end: 3, val: 2 })
      expect(trie.find('apple')).toEqual({ end: 5, val: 3 })
      expect(trie.find('2apple')).toEqual(null)
      expect(trie.find('2apple', 1)).toEqual({ end: 6, val: 3 })

      expect(trie.findAll('bana')).toEqual([{ end: 3, val: 2 }])
      expect(trie.findAll('banana')).toEqual([
        { end: 3, val: 2 },
        { end: 6, val: 1 },
      ])
      expect(trie.findAll('banana', 0, 3)).toEqual([{ end: 3, val: 2 }])
    })
  })

  test('lowercaseIdx', function () {
    const letters: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('')
    for (let i = 0; i < letters.length; ++i) {
      const c = letters[i]
      expect(lowercaseIdx(c)).toBe(i)
    }
  })

  test('uppercaseIdx', function () {
    const letters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    for (let i = 0; i < letters.length; ++i) {
      const c = letters[i]
      expect(uppercaseIdx(c)).toBe(i)
    }
  })

  test('digitIdx', function () {
    const letters: string[] = '0123456789'.split('')
    for (let i = 0; i < letters.length; ++i) {
      const c = letters[i]
      expect(digitIdx(c)).toBe(i)
    }
  })
})
