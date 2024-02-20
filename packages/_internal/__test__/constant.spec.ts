import {
  BIGINT_ONE,
  BIGINT_ZERO,
  CODEPOINT_DIGIT_0,
  CODEPOINT_DIGIT_9,
  CODEPOINT_LOWER_A,
  CODEPOINT_LOWER_Z,
  CODEPOINT_UPPER_A,
  CODEPOINT_UPPER_Z,
} from '../src'

describe('constant', () => {
  it('zero', () => {
    expect(BIGINT_ZERO).toEqual(0n)
  })

  it('one', () => {
    expect(BIGINT_ONE).toEqual(1n)
  })

  describe('codepoint', () => {
    it('0', () => {
      expect(CODEPOINT_DIGIT_0).toEqual(48)
      expect(CODEPOINT_DIGIT_0).toEqual('0'.codePointAt(0))
    })

    it('9', () => {
      expect(CODEPOINT_DIGIT_9).toEqual(57)
      expect(CODEPOINT_DIGIT_9).toEqual('9'.codePointAt(0))
    })

    it('A', () => {
      expect(CODEPOINT_UPPER_A).toEqual(65)
      expect(CODEPOINT_UPPER_A).toEqual('A'.codePointAt(0))
    })

    it('Z', () => {
      expect(CODEPOINT_UPPER_Z).toEqual(90)
      expect(CODEPOINT_UPPER_Z).toEqual('Z'.codePointAt(0))
    })

    it('a', () => {
      expect(CODEPOINT_LOWER_A).toEqual(97)
      expect(CODEPOINT_LOWER_A).toEqual('a'.codePointAt(0))
    })

    it('z', () => {
      expect(CODEPOINT_LOWER_Z).toEqual(122)
      expect(CODEPOINT_LOWER_Z).toEqual('z'.codePointAt(0))
    })
  })
})
