export enum TestOjDataProblemKey {
  // https://codeforces.com/contest/277/problem/E
  CODEFORCES_0277_E = 'codeforces/0277/E',
  // https://codeforces.com/contest/1082/problem/G
  CODEFORCES_1082_G = 'codeforces/1082/G',

  // https://leetcode.com/problems/find-all-people-with-secret/
  LEETCODE_FIND_ALL_PEOPLE_WITH_SECRET = 'leetcode/find-all-people-with-secret',
  // https://leetcode.com/problems/maximum-path-quality-of-a-graph/
  LEETCODE_MAXIMUM_PATH_QUALITY_OF_A_GRAPH = 'leetcode/maximum-path-quality-of-a-graph',
  // https://leetcode.com/problems/maximum-students-taking-exam/
  LEETCODE_MAXIMUM_STUDENTS_TAKING_EXAM = 'leetcode/maximum-students-taking-exam',
  // https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/
  LEETCODE_NUMBER_OF_WAYS_TO_ARRIVE_AT_DESTINATION = 'leetcode/number-of-ways-to-arrive-at-destination',
  // https://leetcode.com/problems/sliding-window-maximum/
  LEETCODE_SLIDING_WINDOW_MAXIMUM = 'leetcode/sliding-window-maximum',
  // https://leetcode.com/problems/word-break-ii/
  LEETCODE_WORD_BREAK_II = 'leetcode/word-break-ii',
  // https://leetcode.com/problems/word-search-ii/
  LEETCODE_WORD_SEARCH_II = 'leetcode/word-search-ii',
}

export interface ITestOjData<P extends any[] = any[], D = any> {
  title: string
  data: Promise<Array<{ input: P; answer: D }>>
}

export function loadTestOjData(key: TestOjDataProblemKey): ITestOjData {
  const { title, fetchData } = DATA_MAP[key]
  return { title, data: fetchData() }
}

export function testOjCodes<T extends (...input: any[]) => any>(
  key: TestOjDataProblemKey,
  solution: Promise<{ default: T }> | T,
): void {
  const isPromise = (object: unknown): object is Promise<unknown> => !!(object as any).then
  const { title, fetchData } = DATA_MAP[key]

  it(title, async function () {
    const data = await fetchData()
    const solve: T = isPromise(solution) ? (await solution).default : solution
    for (const { input, answer } of data) expect(solve(...input)).toEqual(answer)
  })
}

const DATA_MAP = {
  [TestOjDataProblemKey.CODEFORCES_0277_E]: {
    title: TestOjDataProblemKey.CODEFORCES_0277_E,
    fetchData: () => import('@@/fixtures/oj/codeforces/0277/E/data.json').then(md => md.default),
  },
  [TestOjDataProblemKey.CODEFORCES_1082_G]: {
    title: TestOjDataProblemKey.CODEFORCES_1082_G,
    fetchData: () => import('@@/fixtures/oj/codeforces/1082/G/data.json').then(md => md.default),
  },
  [TestOjDataProblemKey.LEETCODE_FIND_ALL_PEOPLE_WITH_SECRET]: {
    title: TestOjDataProblemKey.LEETCODE_FIND_ALL_PEOPLE_WITH_SECRET,
    fetchData: () =>
      import('@@/fixtures/oj/leetcode/find-all-people-with-secret/data.json').then(
        md => md.default,
      ),
  },
  [TestOjDataProblemKey.LEETCODE_MAXIMUM_PATH_QUALITY_OF_A_GRAPH]: {
    title: TestOjDataProblemKey.LEETCODE_MAXIMUM_PATH_QUALITY_OF_A_GRAPH,
    fetchData: () =>
      import('@@/fixtures/oj/leetcode/maximum-path-quality-of-a-graph/data.json').then(
        md => md.default,
      ),
  },
  [TestOjDataProblemKey.LEETCODE_MAXIMUM_STUDENTS_TAKING_EXAM]: {
    title: TestOjDataProblemKey.LEETCODE_MAXIMUM_STUDENTS_TAKING_EXAM,
    fetchData: () =>
      import('@@/fixtures/oj/leetcode/maximum-students-taking-exam/data.json').then(
        md => md.default,
      ),
  },
  [TestOjDataProblemKey.LEETCODE_NUMBER_OF_WAYS_TO_ARRIVE_AT_DESTINATION]: {
    title: TestOjDataProblemKey.LEETCODE_NUMBER_OF_WAYS_TO_ARRIVE_AT_DESTINATION,
    fetchData: () =>
      import('@@/fixtures/oj/leetcode/number-of-ways-to-arrive-at-destination/data.json').then(
        md => md.default,
      ),
  },
  [TestOjDataProblemKey.LEETCODE_SLIDING_WINDOW_MAXIMUM]: {
    title: TestOjDataProblemKey.LEETCODE_SLIDING_WINDOW_MAXIMUM,
    fetchData: () =>
      import('@@/fixtures/oj/leetcode/sliding-window-maximum/data.json').then(md => md.default),
  },
  [TestOjDataProblemKey.LEETCODE_WORD_BREAK_II]: {
    title: TestOjDataProblemKey.LEETCODE_WORD_BREAK_II,
    fetchData: () =>
      import('@@/fixtures/oj/leetcode/word-break-ii/data.json').then(md => md.default),
  },
  [TestOjDataProblemKey.LEETCODE_WORD_SEARCH_II]: {
    title: TestOjDataProblemKey.LEETCODE_WORD_SEARCH_II,
    fetchData: () =>
      import('@@/fixtures/oj/leetcode/word-search-ii/data.json').then(md => md.default),
  },
}
