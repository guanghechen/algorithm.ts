import { alphaNumericIdx, digitIdx, lowercaseIdx, uppercaseIdx } from '../src'

it('digitIdx', () => {
  expect(digitIdx('0')).toEqual(0)
  expect(digitIdx('1')).toEqual(1)
  expect(digitIdx('2')).toEqual(2)
  expect(digitIdx('3')).toEqual(3)
  expect(digitIdx('4')).toEqual(4)
  expect(digitIdx('5')).toEqual(5)
  expect(digitIdx('6')).toEqual(6)
  expect(digitIdx('7')).toEqual(7)
  expect(digitIdx('8')).toEqual(8)
  expect(digitIdx('9')).toEqual(9)
})

it('uppercaseIdx', () => {
  expect(uppercaseIdx('A')).toEqual(0)
  expect(uppercaseIdx('B')).toEqual(1)
  expect(uppercaseIdx('C')).toEqual(2)
  expect(uppercaseIdx('D')).toEqual(3)
  expect(uppercaseIdx('E')).toEqual(4)
  expect(uppercaseIdx('F')).toEqual(5)
  expect(uppercaseIdx('G')).toEqual(6)
  expect(uppercaseIdx('H')).toEqual(7)
  expect(uppercaseIdx('I')).toEqual(8)
  expect(uppercaseIdx('J')).toEqual(9)
  expect(uppercaseIdx('K')).toEqual(10)
  expect(uppercaseIdx('L')).toEqual(11)
  expect(uppercaseIdx('M')).toEqual(12)
  expect(uppercaseIdx('N')).toEqual(13)
  expect(uppercaseIdx('O')).toEqual(14)
  expect(uppercaseIdx('P')).toEqual(15)
  expect(uppercaseIdx('Q')).toEqual(16)
  expect(uppercaseIdx('R')).toEqual(17)
  expect(uppercaseIdx('S')).toEqual(18)
  expect(uppercaseIdx('T')).toEqual(19)
  expect(uppercaseIdx('U')).toEqual(20)
  expect(uppercaseIdx('V')).toEqual(21)
  expect(uppercaseIdx('W')).toEqual(22)
  expect(uppercaseIdx('X')).toEqual(23)
  expect(uppercaseIdx('Y')).toEqual(24)
  expect(uppercaseIdx('Z')).toEqual(25)
})

it('lowercaseIdx', () => {
  expect(lowercaseIdx('a')).toEqual(0)
  expect(lowercaseIdx('b')).toEqual(1)
  expect(lowercaseIdx('c')).toEqual(2)
  expect(lowercaseIdx('d')).toEqual(3)
  expect(lowercaseIdx('e')).toEqual(4)
  expect(lowercaseIdx('f')).toEqual(5)
  expect(lowercaseIdx('g')).toEqual(6)
  expect(lowercaseIdx('h')).toEqual(7)
  expect(lowercaseIdx('i')).toEqual(8)
  expect(lowercaseIdx('j')).toEqual(9)
  expect(lowercaseIdx('k')).toEqual(10)
  expect(lowercaseIdx('l')).toEqual(11)
  expect(lowercaseIdx('m')).toEqual(12)
  expect(lowercaseIdx('n')).toEqual(13)
  expect(lowercaseIdx('o')).toEqual(14)
  expect(lowercaseIdx('p')).toEqual(15)
  expect(lowercaseIdx('q')).toEqual(16)
  expect(lowercaseIdx('r')).toEqual(17)
  expect(lowercaseIdx('s')).toEqual(18)
  expect(lowercaseIdx('t')).toEqual(19)
  expect(lowercaseIdx('u')).toEqual(20)
  expect(lowercaseIdx('v')).toEqual(21)
  expect(lowercaseIdx('w')).toEqual(22)
  expect(lowercaseIdx('x')).toEqual(23)
  expect(lowercaseIdx('y')).toEqual(24)
  expect(lowercaseIdx('z')).toEqual(25)
})

it('alphaNumericIdx', () => {
  // digits
  expect(alphaNumericIdx('0')).toEqual(0)
  expect(alphaNumericIdx('1')).toEqual(1)
  expect(alphaNumericIdx('2')).toEqual(2)
  expect(alphaNumericIdx('3')).toEqual(3)
  expect(alphaNumericIdx('4')).toEqual(4)
  expect(alphaNumericIdx('5')).toEqual(5)
  expect(alphaNumericIdx('6')).toEqual(6)
  expect(alphaNumericIdx('7')).toEqual(7)
  expect(alphaNumericIdx('8')).toEqual(8)
  expect(alphaNumericIdx('9')).toEqual(9)

  // uppercase letters
  expect(alphaNumericIdx('A')).toEqual(10)
  expect(alphaNumericIdx('B')).toEqual(11)
  expect(alphaNumericIdx('C')).toEqual(12)
  expect(alphaNumericIdx('D')).toEqual(13)
  expect(alphaNumericIdx('E')).toEqual(14)
  expect(alphaNumericIdx('F')).toEqual(15)
  expect(alphaNumericIdx('G')).toEqual(16)
  expect(alphaNumericIdx('H')).toEqual(17)
  expect(alphaNumericIdx('I')).toEqual(18)
  expect(alphaNumericIdx('J')).toEqual(19)
  expect(alphaNumericIdx('K')).toEqual(20)
  expect(alphaNumericIdx('L')).toEqual(21)
  expect(alphaNumericIdx('M')).toEqual(22)
  expect(alphaNumericIdx('N')).toEqual(23)
  expect(alphaNumericIdx('O')).toEqual(24)
  expect(alphaNumericIdx('P')).toEqual(25)
  expect(alphaNumericIdx('Q')).toEqual(26)
  expect(alphaNumericIdx('R')).toEqual(27)
  expect(alphaNumericIdx('S')).toEqual(28)
  expect(alphaNumericIdx('T')).toEqual(29)
  expect(alphaNumericIdx('U')).toEqual(30)
  expect(alphaNumericIdx('V')).toEqual(31)
  expect(alphaNumericIdx('W')).toEqual(32)
  expect(alphaNumericIdx('X')).toEqual(33)
  expect(alphaNumericIdx('Y')).toEqual(34)
  expect(alphaNumericIdx('Z')).toEqual(35)

  // lowercase letters
  expect(alphaNumericIdx('a')).toEqual(36)
  expect(alphaNumericIdx('b')).toEqual(37)
  expect(alphaNumericIdx('c')).toEqual(38)
  expect(alphaNumericIdx('d')).toEqual(39)
  expect(alphaNumericIdx('e')).toEqual(40)
  expect(alphaNumericIdx('f')).toEqual(41)
  expect(alphaNumericIdx('g')).toEqual(42)
  expect(alphaNumericIdx('h')).toEqual(43)
  expect(alphaNumericIdx('i')).toEqual(44)
  expect(alphaNumericIdx('j')).toEqual(45)
  expect(alphaNumericIdx('k')).toEqual(46)
  expect(alphaNumericIdx('l')).toEqual(47)
  expect(alphaNumericIdx('m')).toEqual(48)
  expect(alphaNumericIdx('n')).toEqual(49)
  expect(alphaNumericIdx('o')).toEqual(50)
  expect(alphaNumericIdx('p')).toEqual(51)
  expect(alphaNumericIdx('q')).toEqual(52)
  expect(alphaNumericIdx('r')).toEqual(53)
  expect(alphaNumericIdx('s')).toEqual(54)
  expect(alphaNumericIdx('t')).toEqual(55)
  expect(alphaNumericIdx('u')).toEqual(56)
  expect(alphaNumericIdx('v')).toEqual(57)
  expect(alphaNumericIdx('w')).toEqual(58)
  expect(alphaNumericIdx('x')).toEqual(59)
  expect(alphaNumericIdx('y')).toEqual(60)
  expect(alphaNumericIdx('z')).toEqual(61)
})
