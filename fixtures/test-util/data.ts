export enum TestDataType {
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  STRING = 'STRING',
}

export enum TestDataTypeKey {
  // Decimal
  DECIMAL_NEGATIVE = 'DECIMAL_NEGATIVE',
  DECIMAL_NEGATIVE_LOT = 'DECIMAL_NEGATIVE_LOT',
  DECIMAL_NON_NEGATIVE = 'DECIMAL_NON_NEGATIVE',

  // Integer
  INTEGER_NEGATIVE = 'INTEGER_NEGATIVE',
  INTEGER_NEGATIVE_LOT = 'INTEGER_NEGATIVE_LOT',
  INTEGER_NEGATIVE_UNIQUE = 'INTEGER_NEGATIVE_UNIQUE',
  INTEGER_NON_NEGATIVE = 'INTEGER_NON_NEGATIVE',
  INTEGER_NON_NEGATIVE_UNIQUE = 'INTEGER_NON_NEGATIVE_UNIQUE',

  // String
  STRING_FEW = 'STRING_FEW',
  STRING_LOT = 'STRING_LOT',
}

export interface ITestDataNumber {
  type: TestDataType.DECIMAL | TestDataType.INTEGER
  title: string
  data: Promise<number[][]>
}
export interface ITestDataString {
  type: TestDataType.INTEGER
  title: string
  data: Promise<string[][]>
}

export type ITestData = ITestDataNumber | ITestDataString

export function loadTestData(
  key:
    | TestDataTypeKey.DECIMAL_NEGATIVE
    | TestDataTypeKey.DECIMAL_NEGATIVE_LOT
    | TestDataTypeKey.DECIMAL_NON_NEGATIVE
    | TestDataTypeKey.INTEGER_NEGATIVE
    | TestDataTypeKey.INTEGER_NEGATIVE_LOT
    | TestDataTypeKey.INTEGER_NEGATIVE_UNIQUE
    | TestDataTypeKey.INTEGER_NON_NEGATIVE
    | TestDataTypeKey.INTEGER_NON_NEGATIVE_UNIQUE,
): ITestDataNumber
export function loadTestData(
  key: TestDataTypeKey.STRING_FEW | TestDataTypeKey.STRING_LOT,
): ITestDataString
export function loadTestData(key: TestDataTypeKey): ITestData {
  const { type, title, fetchData } = DATA_MAP[key]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return { type, title, data: fetchData() } as ITestData
}

const DATA_MAP = {
  // Decimal
  [TestDataTypeKey.DECIMAL_NEGATIVE]: {
    type: TestDataType.DECIMAL,
    title: 'negative',
    fetchData: () => import('@@/fixtures/test-data/decimal/negative.json').then(md => md.default),
  },
  [TestDataTypeKey.DECIMAL_NEGATIVE_LOT]: {
    type: TestDataType.DECIMAL,
    title: 'negative-lot',
    fetchData: () =>
      import('@@/fixtures/test-data/decimal/negative-lot.json').then(md => md.default),
  },
  [TestDataTypeKey.DECIMAL_NON_NEGATIVE]: {
    type: TestDataType.DECIMAL,
    title: 'non-negative',
    fetchData: () =>
      import('@@/fixtures/test-data/decimal/non-negative.json').then(md => md.default),
  },

  // Integer
  [TestDataTypeKey.INTEGER_NEGATIVE]: {
    type: TestDataType.INTEGER,
    title: 'negative',
    fetchData: () => import('@@/fixtures/test-data/integer/negative.json').then(md => md.default),
  },
  [TestDataTypeKey.INTEGER_NEGATIVE_LOT]: {
    type: TestDataType.INTEGER,
    title: 'negative-lot',
    fetchData: () =>
      import('@@/fixtures/test-data/integer/negative-lot.json').then(md => md.default),
  },
  [TestDataTypeKey.INTEGER_NEGATIVE_UNIQUE]: {
    type: TestDataType.INTEGER,
    title: 'negative-unique',
    fetchData: () =>
      import('@@/fixtures/test-data/integer/negative-unique.json').then(md => md.default),
  },
  [TestDataTypeKey.INTEGER_NON_NEGATIVE]: {
    type: TestDataType.INTEGER,
    title: 'non-negative',
    fetchData: () =>
      import('@@/fixtures/test-data/integer/non-negative.json').then(md => md.default),
  },
  [TestDataTypeKey.INTEGER_NON_NEGATIVE_UNIQUE]: {
    type: TestDataType.INTEGER,
    title: 'non-negative-unique',
    fetchData: () =>
      import('@@/fixtures/test-data/integer/non-negative-unique.json').then(md => md.default),
  },

  // String
  [TestDataTypeKey.STRING_FEW]: {
    type: TestDataType.STRING,
    title: 'few',
    fetchData: () => import('@@/fixtures/test-data/string/few.json').then(md => md.default),
  },
  [TestDataTypeKey.STRING_LOT]: {
    type: TestDataType.STRING,
    title: 'lot',
    fetchData: () => import('@@/fixtures/test-data/string/lot.json').then(md => md.default),
  },
} as const
