import { randomInt } from '../src'

afterEach(() => {
  vi.restoreAllMocks()
})

it.each([
  { bound: 100, draw: 0, expected: 0 },
  { bound: 3, draw: 0.5, expected: 1 },
  { bound: 2 ** 31 + 1, draw: 1 - Number.EPSILON, expected: 2 ** 31 },
  { bound: 2 ** 32 - 1, draw: 1 - Number.EPSILON, expected: 2 ** 32 - 2 },
])('randomInt($bound) maps $draw to $expected', ({ bound, draw, expected }) => {
  vi.spyOn(Math, 'random').mockReturnValue(draw)
  expect(randomInt(bound)).toBe(expected)
})
