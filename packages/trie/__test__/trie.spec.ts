import { TestDataTypeKey, loadTestData } from '@@/fixtures/test-util/data'
import type { ITrie } from '../src'
import { Trie, UnsafeTrie, alphaNumericIdx, digitIdx, lowercaseIdx, uppercaseIdx } from '../src'

const testData = [
  loadTestData(TestDataTypeKey.STRING_FEW),
  loadTestData(TestDataTypeKey.STRING_LOT),
]

describe('unsafe-trie', function () {
  test('basic', function () {
    const trie: ITrie<string, number> = new UnsafeTrie<string, number>({
      SIGMA_SIZE: 62,
      idx: alphaNumericIdx,
      mergeNodeValue: (x, y) => x + y,
    })

    expect(trie.size).toEqual(0)
    expect(trie.get('dog')).toEqual(undefined)
    expect(trie.has('dog')).toEqual(false)

    trie.set('dog', 1)
    expect(trie.get('dog')).toEqual(1)
    expect(trie.has('dog')).toEqual(true)

    trie.delete('dog')
    expect(trie.get('dog')).toEqual(undefined)
    expect(trie.has('dog')).toEqual(false)
    expect(trie.size).toEqual(0)
    expect(trie.hasPrefix('')).toEqual(false)

    trie.set('app', 1)
    trie.set('apple', 10)
    expect(trie.find('app')).toEqual({ end: 3, val: 1 })
    expect(trie.find('apple')).toEqual({ end: 3, val: 1 })
    expect(Array.from(trie.findAll('apple'))).toEqual([
      { end: 3, val: 1 },
      { end: 5, val: 10 },
    ])
    expect(Array.from(trie.findAll('apple', 0, 3))).toEqual([{ end: 3, val: 1 }])
    expect(trie.hasPrefix('')).toEqual(true)
  })
})

describe('trie', function () {
  describe('multiple words', function () {
    const trie: ITrie<string, string> = new Trie<string, string>({
      SIGMA_SIZE: 62,
      idx: alphaNumericIdx,
      mergeNodeValue: (x, y) => x + y,
    })

    const set = new Set<string>()
    for (const { title, data } of testData) {
      test(`${title}`, async function () {
        const inputs = await data
        for (let caseNo = 0; caseNo < inputs.length; ++caseNo) {
          let failedCount = 0
          const words = inputs[caseNo]
          trie.clear()
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

  describe('basic', function () {
    const trie = new Trie<string, number>({
      SIGMA_SIZE: 62,
      idx: alphaNumericIdx,
      mergeNodeValue: (x, y) => x + y,
    })

    test('set / delete / get / has', function () {
      trie.clear()

      expect(trie.size).toEqual(0)
      expect(trie.get('cat')).toEqual(undefined)

      trie.set('cat', 1)
      expect(trie.size).toEqual(1)
      trie.set('cat2', 2)
      expect(trie.size).toEqual(2)
      expect(trie.get('cat')).toEqual(1)
      expect(trie.get('cat2')).toEqual(2)
      expect(trie.get('cat2', 0, 3)).toEqual(1)
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

      trie.clear()
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
      expect(trie.get('cato', -1, 3)).toEqual(33)
      expect(trie.get('cato', -1, 4)).toEqual(undefined)
      expect(trie.get('cat', -1, 4)).toEqual(33)
      expect(trie.has('cat')).toEqual(true)
      expect(trie.has('cat0', 0, 3)).toEqual(true)
      expect(trie.has('cat0', -1, 3)).toEqual(true)
      expect(trie.has('cat0', 0, 5)).toEqual(false)
      expect(trie.has('cat0')).toEqual(false)
      expect(trie.has('cat0', 3, 3)).toEqual(false)

      expect(trie.find('cat0', 0, 3)).toEqual({ end: 3, val: 33 })
      expect(trie.find('cat0', -1, 3)).toEqual({ end: 3, val: 33 })
      expect(trie.find('cat0', 0, 5)).toEqual({ end: 3, val: 33 })
      expect(trie.find('cat0')).toEqual({ end: 3, val: 33 })
      expect(trie.find('cat0', 3, 3)).toEqual(undefined)

      trie.set('ca', 22)
      expect(Array.from(trie.findAll('cat0', 0, 3))).toEqual([
        { end: 2, val: 22 },
        { end: 3, val: 33 },
      ])
      expect(Array.from(trie.findAll('cat0', -1, 3))).toEqual([
        { end: 2, val: 22 },
        { end: 3, val: 33 },
      ])
      expect(Array.from(trie.findAll('cat0', 0, 5))).toEqual([
        { end: 2, val: 22 },
        { end: 3, val: 33 },
      ])
      expect(Array.from(trie.findAll('cat0'))).toEqual([
        { end: 2, val: 22 },
        { end: 3, val: 33 },
      ])
      expect(Array.from(trie.findAll('cat0', 3, 3))).toEqual([])

      trie.clear()
      trie.set('apple', 2)
      expect(trie.has('apple')).toEqual(true)
      trie.delete('apple', -1)
      expect(trie.has('apple')).toEqual(false)

      trie.set('apple', 0)
      expect(trie.has('apple')).toEqual(true)
      trie.delete('apple', -1)
      expect(trie.has('apple')).toEqual(false)

      trie.set('apple', 0)
      expect(trie.has('apple')).toEqual(true)
      trie.delete('apple', 1, 7)
      expect(trie.has('apple')).toEqual(true)
      trie.delete('apple', 3, 2)
      expect(trie.has('apple')).toEqual(true)
      trie.delete('apple', 0, 7)
      expect(trie.has('apple')).toEqual(false)
    })

    test('hasPrefix', function () {
      trie.clear()
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

      expect(trie.hasPrefix('apple', 0, 0)).toEqual(true)
      expect(trie.hasPrefix('apple', 0, 1)).toEqual(true)
      expect(trie.hasPrefix('apple', 0, 2)).toEqual(true)
      expect(trie.hasPrefix('apple', 0, 3)).toEqual(true)
      expect(trie.hasPrefix('apple', 0, 4)).toEqual(true)
      expect(trie.hasPrefix('apple', 0, 5)).toEqual(true)
      expect(trie.hasPrefix('apple', 0, 6)).toEqual(true)
      expect(trie.hasPrefix('apple', -1, 0)).toEqual(true)
      expect(trie.hasPrefix('apple', -1, 1)).toEqual(true)
      expect(trie.hasPrefix('apple', -1, 2)).toEqual(true)
      expect(trie.hasPrefix('apple', -1, 3)).toEqual(true)
      expect(trie.hasPrefix('apple', -1, 4)).toEqual(true)
      expect(trie.hasPrefix('apple', -1, 5)).toEqual(true)
      expect(trie.hasPrefix('apple', -1, 6)).toEqual(true)
    })

    test('findAll', function () {
      trie.clear()
      trie.set('ban', 2)
      trie.set('banana', 1)
      trie.set('apple', 3)

      expect(trie.find('ban')).toEqual({ end: 3, val: 2 })
      expect(trie.find('bana')).toEqual({ end: 3, val: 2 })
      expect(trie.find('banana')).toEqual({ end: 3, val: 2 })
      expect(trie.find('apple')).toEqual({ end: 5, val: 3 })
      expect(trie.find('2apple')).toEqual(undefined)
      expect(trie.find('2apple', 1)).toEqual({ end: 6, val: 3 })

      expect(Array.from(trie.findAll('bab'))).toEqual([])
      expect(Array.from(trie.findAll('bana'))).toEqual([{ end: 3, val: 2 }])
      expect(Array.from(trie.findAll('banana'))).toEqual([
        { end: 3, val: 2 },
        { end: 6, val: 1 },
      ])
      expect(Array.from(trie.findAll('banana', 0, 3))).toEqual([{ end: 3, val: 2 }])
    })
  })

  test('mergeNodeValue', function () {
    const trie = new Trie<string, number>({
      SIGMA_SIZE: 62,
      idx: alphaNumericIdx,
      mergeNodeValue: (_x, y) => y,
    })

    trie.clear()

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

  test('digitIdx', function () {
    const letters: string[] = '0123456789'.split('')
    for (let i = 0; i < letters.length; ++i) {
      const c = letters[i]
      expect(digitIdx(c)).toEqual(i)
    }
  })

  test('uppercaseIdx', function () {
    const letters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    for (let i = 0; i < letters.length; ++i) {
      const c = letters[i]
      expect(uppercaseIdx(c)).toEqual(i)
    }
  })

  test('lowercaseIdx', function () {
    const letters: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('')
    for (let i = 0; i < letters.length; ++i) {
      const c = letters[i]
      expect(lowercaseIdx(c)).toEqual(i)
    }
  })

  test('alphaNumericIdx', function () {
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

  describe('edge', function () {
    test('constructor', function () {
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

    test('destroy', function () {
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

      trie.destroy()
      expect(() => trie.set('apple', 2)).toThrow(/Cannot read properties of undefined/)
      expect(() => trie.get('apple')).toThrow(/Cannot read properties of undefined/)
      expect(() => trie.find('apple')).toThrow(/Cannot read properties of undefined/)
      expect(() => Array.from(trie.findAll('apple'))).toThrow(/Cannot read properties of undefined/)
    })

    test('custom ranges', function () {
      const trie = new Trie<string, number>({
        SIGMA_SIZE: 62,
        idx: alphaNumericIdx,
        mergeNodeValue: (x, y) => x + y,
      })

      trie.clear()
      trie.set('apple', 101, -1, 3)
      expect(trie.get('apple', -1, 3)).toEqual(101)
      expect(trie.get('apple', 0, 3)).toEqual(101)
      expect(trie.get('apple', 0, 2)).toEqual(undefined)
      expect(trie.get('apple', 0, 4)).toEqual(undefined)

      trie.set('apple', 102, 1, 7)
      expect(trie.get('apple', 1, 7)).toEqual(102)
      expect(trie.get('apple', 1, 5)).toEqual(102)
      expect(trie.get('apple', 0, 4)).toEqual(undefined)
      expect(trie.get('apple', 0, 3)).toEqual(101)

      expect(trie.find('')).toEqual(undefined)
      expect(trie.find('apple', 3, 3)).toEqual(undefined)
      expect(Array.from(trie.findAll(''))).toEqual([])
      expect(Array.from(trie.findAll('apple', 3, 3))).toEqual([])

      trie.set('', 99)
      expect(trie.find('')).toEqual({ end: 0, val: 99 })
      expect(trie.find('apple', 3, 3)).toEqual({ end: 3, val: 99 })
      expect(Array.from(trie.findAll(''))).toEqual([{ end: 0, val: 99 }])
      expect(Array.from(trie.findAll('apple', 3, 3))).toEqual([{ end: 3, val: 99 }])
    })
  })
})
