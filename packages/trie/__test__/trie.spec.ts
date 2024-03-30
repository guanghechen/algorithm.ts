import { TestDataTypeKey, loadTestData } from '@@/fixtures/test-util/data'
import { alphaNumericIdx, digitIdx, lowercaseIdx, uppercaseIdx } from '@algorithm.ts/internal'
import type { ITrie } from '../src'
import { Trie } from '../src'

const testData = [
  loadTestData(TestDataTypeKey.STRING_FEW),
  loadTestData(TestDataTypeKey.STRING_LOT),
]

describe('Trie', () => {
  describe('multiple words', () => {
    const trie: ITrie<string, string> = new Trie<string, string>({
      SIGMA_SIZE: 62,
      idx: alphaNumericIdx,
      mergeNodeValue: (x, y) => x + y,
    })

    const set = new Set<string>()
    for (const { title, data } of testData) {
      it(`${title}`, async () => {
        const inputs = await data
        for (let caseNo = 0; caseNo < inputs.length; ++caseNo) {
          let failedCount = 0
          const words = inputs[caseNo]
          trie.init()
          set.clear()
          for (const word of words) {
            const existed1: boolean = trie.has(word)
            const existed2: boolean = set.has(word)
            if (existed1 !== existed2) failedCount += 1
            trie.set(word, word)
            set.add(word)
          }

          expect(Array.from(trie)).toEqual(Array.from(set).sort())

          for (const word of words) {
            if (set.size !== trie.size) failedCount += 1
            set.delete(word)
            trie.delete(word)
          }
          expect(failedCount).toEqual(0)
          expect(set.size).toEqual(0)
          expect(trie.size).toEqual(0)
        }
      })
    }
  })

  describe('basic', () => {
    const trie = new Trie<string, number>({
      SIGMA_SIZE: 62,
      idx: alphaNumericIdx,
      mergeNodeValue: (x, y) => x + y,
    })

    it('set_advance', () => {
      trie.init()

      expect(trie.size).toEqual(0)
      expect(trie.get('c')).toEqual(undefined)
      expect(trie.get('ca')).toEqual(undefined)
      expect(trie.get('cat')).toEqual(undefined)
      expect(trie.get('a')).toEqual(undefined)
      expect(trie.get('at')).toEqual(undefined)
      expect(trie.get('t')).toEqual(undefined)
      expect(trie.get('')).toEqual(undefined)
      expect(trie.has('c')).toEqual(false)
      expect(trie.has('ca')).toEqual(false)
      expect(trie.has('cat')).toEqual(false)
      expect(trie.has('a')).toEqual(false)
      expect(trie.has('at')).toEqual(false)
      expect(trie.has('t')).toEqual(false)
      expect(trie.has('')).toEqual(false)

      trie.set_advance('cat', 1, 0, 1)
      expect(trie.size).toEqual(1)
      expect(trie.get('c')).toEqual(1)
      expect(trie.get('ca')).toEqual(undefined)
      expect(trie.get('cat')).toEqual(undefined)
      expect(trie.get('a')).toEqual(undefined)
      expect(trie.get('at')).toEqual(undefined)
      expect(trie.get('t')).toEqual(undefined)
      expect(trie.get('')).toEqual(undefined)
      expect(trie.has('c')).toEqual(true)
      expect(trie.has('ca')).toEqual(false)
      expect(trie.has('cat')).toEqual(false)
      expect(trie.has('a')).toEqual(false)
      expect(trie.has('at')).toEqual(false)
      expect(trie.has('t')).toEqual(false)
      expect(trie.has('')).toEqual(false)

      trie.set_advance('cat', 2, 0, 2)
      expect(trie.size).toEqual(2)
      expect(trie.get('c')).toEqual(1)
      expect(trie.get('ca')).toEqual(2)
      expect(trie.get('cat')).toEqual(undefined)
      expect(trie.get('a')).toEqual(undefined)
      expect(trie.get('at')).toEqual(undefined)
      expect(trie.get('t')).toEqual(undefined)
      expect(trie.get('')).toEqual(undefined)
      expect(trie.has('c')).toEqual(true)
      expect(trie.has('ca')).toEqual(true)
      expect(trie.has('cat')).toEqual(false)
      expect(trie.has('a')).toEqual(false)
      expect(trie.has('at')).toEqual(false)
      expect(trie.has('t')).toEqual(false)
      expect(trie.has('')).toEqual(false)

      trie.set_advance('cat', 3, 0, 3)
      expect(trie.size).toEqual(3)
      expect(trie.get('c')).toEqual(1)
      expect(trie.get('ca')).toEqual(2)
      expect(trie.get('cat')).toEqual(3)
      expect(trie.get('a')).toEqual(undefined)
      expect(trie.get('at')).toEqual(undefined)
      expect(trie.get('t')).toEqual(undefined)
      expect(trie.get('')).toEqual(undefined)
      expect(trie.has('c')).toEqual(true)
      expect(trie.has('ca')).toEqual(true)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has('a')).toEqual(false)
      expect(trie.has('at')).toEqual(false)
      expect(trie.has('t')).toEqual(false)
      expect(trie.has('')).toEqual(false)

      trie.set_advance('cat', 4, 1, 2)
      expect(trie.size).toEqual(4)
      expect(trie.get('c')).toEqual(1)
      expect(trie.get('ca')).toEqual(2)
      expect(trie.get('cat')).toEqual(3)
      expect(trie.get('a')).toEqual(4)
      expect(trie.get('at')).toEqual(undefined)
      expect(trie.get('t')).toEqual(undefined)
      expect(trie.get('')).toEqual(undefined)
      expect(trie.has('c')).toEqual(true)
      expect(trie.has('ca')).toEqual(true)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has('a')).toEqual(true)
      expect(trie.has('at')).toEqual(false)
      expect(trie.has('t')).toEqual(false)
      expect(trie.has('')).toEqual(false)

      trie.set_advance('cat', 100, 1, 3)
      expect(trie.size).toEqual(5)
      expect(trie.get('c')).toEqual(1)
      expect(trie.get('ca')).toEqual(2)
      expect(trie.get('cat')).toEqual(3)
      expect(trie.get('a')).toEqual(4)
      expect(trie.get('at')).toEqual(100)
      expect(trie.get('t')).toEqual(undefined)
      expect(trie.get('')).toEqual(undefined)
      expect(trie.has('c')).toEqual(true)
      expect(trie.has('ca')).toEqual(true)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has('a')).toEqual(true)
      expect(trie.has('at')).toEqual(true)
      expect(trie.has('t')).toEqual(false)
      expect(trie.has('')).toEqual(false)

      trie.set_advance('cat', 103, 2, 3)
      expect(trie.size).toEqual(6)
      expect(trie.get('c')).toEqual(1)
      expect(trie.get('ca')).toEqual(2)
      expect(trie.get('cat')).toEqual(3)
      expect(trie.get('a')).toEqual(4)
      expect(trie.get('at')).toEqual(100)
      expect(trie.get('t')).toEqual(103)
      expect(trie.get('')).toEqual(undefined)
      expect(trie.has('c')).toEqual(true)
      expect(trie.has('ca')).toEqual(true)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has('a')).toEqual(true)
      expect(trie.has('at')).toEqual(true)
      expect(trie.has('t')).toEqual(true)
      expect(trie.has('')).toEqual(false)

      trie.set_advance('cat', 120, 3, 3)
      expect(trie.size).toEqual(7)
      expect(trie.get('c')).toEqual(1)
      expect(trie.get('ca')).toEqual(2)
      expect(trie.get('cat')).toEqual(3)
      expect(trie.get('a')).toEqual(4)
      expect(trie.get('at')).toEqual(100)
      expect(trie.get('t')).toEqual(103)
      expect(trie.get('')).toEqual(120)
      expect(trie.has('c')).toEqual(true)
      expect(trie.has('ca')).toEqual(true)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has('a')).toEqual(true)
      expect(trie.has('at')).toEqual(true)
      expect(trie.has('t')).toEqual(true)
      expect(trie.has('')).toEqual(true)

      trie.set('cat', 20)
      expect(trie.size).toEqual(7)
      expect(trie.get('c')).toEqual(1)
      expect(trie.get('ca')).toEqual(2)
      expect(trie.get('cat')).toEqual(23)
      expect(trie.get('a')).toEqual(4)
      expect(trie.get('at')).toEqual(100)
      expect(trie.get('t')).toEqual(103)
      expect(trie.get('')).toEqual(120)
      expect(trie.has('c')).toEqual(true)
      expect(trie.has('ca')).toEqual(true)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has('a')).toEqual(true)
      expect(trie.has('at')).toEqual(true)
      expect(trie.has('t')).toEqual(true)
      expect(trie.has('')).toEqual(true)

      trie.set_advance('cat', 5, 1, 2)
      expect(trie.size).toEqual(7)
      expect(trie.get('c')).toEqual(1)
      expect(trie.get('ca')).toEqual(2)
      expect(trie.get('cat')).toEqual(23)
      expect(trie.get('a')).toEqual(9)
      expect(trie.get('at')).toEqual(100)
      expect(trie.get('t')).toEqual(103)
      expect(trie.get('')).toEqual(120)
      expect(trie.has('c')).toEqual(true)
      expect(trie.has('ca')).toEqual(true)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has('a')).toEqual(true)
      expect(trie.has('at')).toEqual(true)
      expect(trie.has('t')).toEqual(true)
      expect(trie.has('')).toEqual(true)

      expect(trie.delete('cat')).toEqual(true)
      expect(trie.size).toEqual(6)
      expect(trie.get('c')).toEqual(1)
      expect(trie.get('ca')).toEqual(2)
      expect(trie.get('cat')).toEqual(undefined)
      expect(trie.get('a')).toEqual(9)
      expect(trie.get('at')).toEqual(100)
      expect(trie.get('t')).toEqual(103)
      expect(trie.get('')).toEqual(120)
      expect(trie.has('c')).toEqual(true)
      expect(trie.has('ca')).toEqual(true)
      expect(trie.has('cat')).toEqual(false)
      expect(trie.has('a')).toEqual(true)
      expect(trie.has('at')).toEqual(true)
      expect(trie.has('t')).toEqual(true)
      expect(trie.has('')).toEqual(true)

      trie.init()
      expect(trie.size).toEqual(0)
      expect(trie.get('c')).toEqual(undefined)
      expect(trie.get('ca')).toEqual(undefined)
      expect(trie.get('cat')).toEqual(undefined)
      expect(trie.get('a')).toEqual(undefined)
      expect(trie.get('at')).toEqual(undefined)
      expect(trie.get('t')).toEqual(undefined)
      expect(trie.get('')).toEqual(undefined)
      expect(trie.has('c')).toEqual(false)
      expect(trie.has('ca')).toEqual(false)
      expect(trie.has('cat')).toEqual(false)
      expect(trie.has('a')).toEqual(false)
      expect(trie.has('at')).toEqual(false)
      expect(trie.has('t')).toEqual(false)
      expect(trie.has('')).toEqual(false)

      trie.set_advance('cat', 0, 0, 3)
      expect(trie.size).toEqual(1)
      expect(trie.get('c')).toEqual(undefined)
      expect(trie.get('ca')).toEqual(undefined)
      expect(trie.get('cat')).toEqual(0)
      expect(trie.get('a')).toEqual(undefined)
      expect(trie.get('at')).toEqual(undefined)
      expect(trie.get('t')).toEqual(undefined)
      expect(trie.get('')).toEqual(undefined)
      expect(trie.has('c')).toEqual(false)
      expect(trie.has('ca')).toEqual(false)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has('a')).toEqual(false)
      expect(trie.has('at')).toEqual(false)
      expect(trie.has('t')).toEqual(false)
      expect(trie.has('')).toEqual(false)

      expect(trie.delete('c')).toEqual(false)
      expect(trie.size).toEqual(1)
      expect(trie.get('c')).toEqual(undefined)
      expect(trie.get('ca')).toEqual(undefined)
      expect(trie.get('cat')).toEqual(0)
      expect(trie.get('a')).toEqual(undefined)
      expect(trie.get('at')).toEqual(undefined)
      expect(trie.get('t')).toEqual(undefined)
      expect(trie.get('')).toEqual(undefined)
      expect(trie.has('c')).toEqual(false)
      expect(trie.has('ca')).toEqual(false)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has('a')).toEqual(false)
      expect(trie.has('at')).toEqual(false)
      expect(trie.has('t')).toEqual(false)
      expect(trie.has('')).toEqual(false)

      expect(trie.hasPrefix_advance('cat', 0, 3)).toEqual(true)
      expect(trie.hasPrefix_advance('cat', 1, 3)).toEqual(false)
    })

    it('set / delete / get / has', () => {
      trie.init()

      expect(trie.size).toEqual(0)
      expect(trie.get('cat')).toEqual(undefined)

      trie.set('cat', 1)
      expect(trie.size).toEqual(1)
      trie.set('cat2', 2)
      expect(trie.size).toEqual(2)
      expect(trie.get('cat')).toEqual(1)
      expect(trie.get('cat2')).toEqual(2)
      expect(trie.get_advance('cat2', 0, 3)).toEqual(1)
      expect(trie.get('cat3')).toEqual(undefined)

      trie.set('apple', 1)
      expect(trie.size).toEqual(3)
      expect(trie.get('apple')).toEqual(1)
      expect(trie.get('app')).toEqual(undefined)

      trie.set('apple', 2)
      expect(trie.size).toEqual(3)
      expect(trie.get('apple')).toEqual(3)

      trie.set('apple', 9)
      expect(trie.size).toEqual(3)
      expect(trie.get('apple')).toEqual(12)

      trie.init()
      expect(trie.get('cat')).toEqual(undefined)
      trie.set('0Aa', 1)
      expect(trie.get('0Aa')).toEqual(1)
      expect(trie.get('0aA')).toEqual(undefined)
      expect(trie.get('A0a')).toEqual(undefined)
      expect(trie.get('Aa0')).toEqual(undefined)
      expect(trie.get('a0A')).toEqual(undefined)
      expect(trie.get('aA0')).toEqual(undefined)

      trie.delete('0Aa')
      expect(trie.get('0Aa')).toEqual(undefined)

      expect(trie.get('abc1239Zz')).toEqual(undefined)
      trie.delete('abc1239Zz')
      expect(trie.get('abc1239Zz')).toEqual(undefined)

      trie.set('0Aa', 21)
      expect(trie.get('0Aa')).toEqual(21)

      expect(trie.get('abc1239Zz')).toEqual(undefined)
      trie.set('abc1239Zz', 22)
      expect(trie.get('abc1239Zz')).toEqual(22)

      trie.set('cat', 33)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has_advance('cat0', 0, 3)).toEqual(true)
      expect(trie.has_advance('cat0', 0, 4)).toEqual(false)
      expect(trie.has('cat0')).toEqual(false)
      expect(trie.has_advance('cat0', 3, 3)).toEqual(false)

      trie.set('ca', 22)
      expect(Array.from(trie.findAll_advance('cat0', 0, 3))).toEqual([
        { end: 2, val: 22 },
        { end: 3, val: 33 },
      ])
      expect(Array.from(trie.findAll_advance('cat0', 0, 4))).toEqual([
        { end: 2, val: 22 },
        { end: 3, val: 33 },
      ])
      expect(Array.from(trie.findAll('cat0'))).toEqual([
        { end: 2, val: 22 },
        { end: 3, val: 33 },
      ])
      expect(Array.from(trie.findAll_advance('cat0', 3, 3))).toEqual([])

      trie.init()
      trie.set('apple', 2)
      expect(trie.has('apple')).toEqual(true)
      trie.delete('apple')
      expect(trie.has('apple')).toEqual(false)

      trie.set('apple', 0)
      expect(trie.has('apple')).toEqual(true)
      trie.delete('apple')
      expect(trie.has('apple')).toEqual(false)

      trie.set('apple', 0)
      expect(trie.has('apple')).toEqual(true)
      trie.delete_advance('apple', 1, 4)
      expect(trie.has('apple')).toEqual(true)
      trie.delete_advance('apple', 3, 2)
      expect(trie.has('apple')).toEqual(true)
      trie.delete_advance('apple', 0, 4)
      expect(trie.has('apple')).toEqual(true)
      trie.delete_advance('apple', 0, 5)
      expect(trie.has('apple')).toEqual(false)
    })

    it('hasPrefix', () => {
      trie.init()
      expect(trie.hasPrefix('')).toEqual(false)

      trie.set('apple', 1)
      expect(trie.hasPrefix('')).toEqual(true)

      expect(trie.hasPrefix('a')).toEqual(true)
      expect(trie.hasPrefix('ap')).toEqual(true)
      expect(trie.hasPrefix('app')).toEqual(true)
      expect(trie.hasPrefix('appl')).toEqual(true)
      expect(trie.hasPrefix('apple')).toEqual(true)
      expect(trie.hasPrefix('applea')).toEqual(false)
      expect(trie.hasPrefix('b')).toEqual(false)

      expect(trie.hasPrefix_advance('apple', 0, 0)).toEqual(true)
      expect(trie.hasPrefix_advance('apple', 0, 1)).toEqual(true)
      expect(trie.hasPrefix_advance('apple', 0, 2)).toEqual(true)
      expect(trie.hasPrefix_advance('apple', 0, 3)).toEqual(true)
      expect(trie.hasPrefix_advance('apple', 0, 4)).toEqual(true)
      expect(trie.hasPrefix_advance('apple', 0, 5)).toEqual(true)
    })

    it('findAll', () => {
      trie.init()
      trie.set('ban', 2)
      trie.set('banana', 1)
      trie.set('apple', 3)

      expect(Array.from(trie.findAll('bab'))).toEqual([])
      expect(Array.from(trie.findAll('bana'))).toEqual([{ end: 3, val: 2 }])
      expect(Array.from(trie.findAll('banana'))).toEqual([
        { end: 3, val: 2 },
        { end: 6, val: 1 },
      ])
      expect(Array.from(trie.findAll_advance('banana', 0, 3))).toEqual([{ end: 3, val: 2 }])
    })
  })

  it('mergeNodeValue', () => {
    const trie = new Trie<string, number>({
      SIGMA_SIZE: 62,
      idx: alphaNumericIdx,
      mergeNodeValue: (_x, y) => y,
    })

    trie.init()

    trie.set('apple', 1)
    expect(trie.get('apple')).toEqual(1)

    trie.set('apple', 2)
    expect(trie.get('apple')).toEqual(2)

    trie.set('apple', -1)
    expect(trie.get('apple')).toEqual(-1)

    trie.set('appl', 3)
    expect(trie.get('appl')).toEqual(3)
    expect(trie.get('apple')).toEqual(-1)
  })

  it('digitIdx', () => {
    const letters: string[] = '0123456789'.split('')
    for (let i = 0; i < letters.length; ++i) {
      const c = letters[i]
      expect(digitIdx(c)).toEqual(i)
    }
  })

  it('uppercaseIdx', () => {
    const letters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    for (let i = 0; i < letters.length; ++i) {
      const c = letters[i]
      expect(uppercaseIdx(c)).toEqual(i)
    }
  })

  it('lowercaseIdx', () => {
    const letters: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('')
    for (let i = 0; i < letters.length; ++i) {
      const c = letters[i]
      expect(lowercaseIdx(c)).toEqual(i)
    }
  })

  it('alphaNumericIdx', () => {
    const digits: string[] = '0123456789'.split('')
    for (let i = 0; i < digits.length; ++i) {
      const c = digits[i]
      expect(alphaNumericIdx(c)).toEqual(i)
    }

    const upperLetters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    for (let i = 0; i < upperLetters.length; ++i) {
      const c = upperLetters[i]
      expect(alphaNumericIdx(c)).toEqual(i + 10)
    }

    const lowerLetters: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('')
    for (let i = 0; i < lowerLetters.length; ++i) {
      const c = lowerLetters[i]
      expect(alphaNumericIdx(c)).toEqual(i + 36)
    }
  })

  describe('edge', () => {
    it('constructor', () => {
      expect(
        () => new Trie<string, number>({ SIGMA_SIZE: 0, idx: () => 0, mergeNodeValue: () => -1 }),
      ).toThrow(RangeError)
      expect(
        () => new Trie<string, number>({ SIGMA_SIZE: -1, idx: () => 0, mergeNodeValue: () => -1 }),
      ).toThrow(RangeError)
      expect(
        () => new Trie<string, number>({ SIGMA_SIZE: 1, idx: () => 0, mergeNodeValue: () => -1 }),
      ).not.toThrow(RangeError)
    })

    it('destroy', () => {
      const trie = new Trie<string, number>({
        SIGMA_SIZE: 62,
        idx: alphaNumericIdx,
        mergeNodeValue: (x, y) => x + y,
      })

      expect(trie.get('apple')).toEqual(undefined)
      trie.set('apple', 2)
      expect(trie.get('apple')).toEqual(2)
      trie.set('apple', 3)
      expect(trie.get('apple')).toEqual(5)

      expect(trie.destroyed).toEqual(false)

      trie.destroy()
      expect(trie.destroyed).toEqual(true)

      trie.destroy()
      expect(trie.destroyed).toEqual(true)

      expect(() => trie.init()).toThrow('[Trie] `init` is not allowed since it has been destroyed')
    })

    it('custom ranges', () => {
      const trie = new Trie<string, number>({
        SIGMA_SIZE: 62,
        idx: alphaNumericIdx,
        mergeNodeValue: (x, y) => x + y,
      })

      trie.init()
      trie.set_advance('apple', 101, 0, 3)
      expect(trie.get_advance('apple', 0, 3)).toEqual(101)
      expect(trie.get_advance('apple', 0, 3)).toEqual(101)
      expect(trie.get_advance('apple', 0, 2)).toEqual(undefined)
      expect(trie.get_advance('apple', 0, 4)).toEqual(undefined)

      trie.set_advance('apple', 102, 1, 5)
      expect(trie.get_advance('apple', 1, 5)).toEqual(102)
      expect(trie.get_advance('apple', 0, 4)).toEqual(undefined)
      expect(trie.get_advance('apple', 0, 3)).toEqual(101)

      expect(Array.from(trie.findAll(''))).toEqual([])
      expect(Array.from(trie.findAll_advance('apple', 3, 3))).toEqual([])

      trie.set('', 99)
      expect(Array.from(trie.findAll(''))).toEqual([{ end: 0, val: 99 }])
      expect(Array.from(trie.findAll_advance('apple', 3, 3))).toEqual([{ end: 3, val: 99 }])
    })
  })
})
