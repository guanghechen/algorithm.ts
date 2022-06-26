import { GomokuStateCache } from '../src'

describe('state-cache', function () {
  test('default', function () {
    new GomokuStateCache(BigInt(225))
  })

  test('max element', function () {
    const MAX_STATES = 5
    const cache = new GomokuStateCache(BigInt(225), 5)
    const INITIAL_STATE: bigint = cache.INITIAL_STATE

    expect(cache.calcNextState(0, INITIAL_STATE, 112)).toEqual(368n)

    for (let i = 0; i < MAX_STATES; ++i) {
      const s: bigint = INITIAL_STATE + BigInt(i)
      cache.set(s, i)
      expect(cache.get(s)).toBe(i)
    }

    for (let i = 0; i < MAX_STATES; ++i) {
      const s: bigint = INITIAL_STATE + BigInt(i)
      expect(cache.get(s)).toBe(i)
    }

    const EXTERNAL_STATE: bigint = INITIAL_STATE + BigInt(MAX_STATES + 20)
    cache.set(EXTERNAL_STATE, 2)
    expect(cache.get(EXTERNAL_STATE)).toBeUndefined()

    for (let i = 0; i < MAX_STATES; ++i) {
      const s: bigint = INITIAL_STATE + BigInt(i)
      expect(cache.get(s)).toBe(i)
    }

    cache.clear()
    cache.set(EXTERNAL_STATE, 2)
    expect(cache.get(EXTERNAL_STATE)).toBe(2)

    for (let i = 0; i < MAX_STATES; ++i) {
      const s: bigint = INITIAL_STATE + BigInt(i)
      expect(cache.get(s)).toBeUndefined()
    }
  })
})
