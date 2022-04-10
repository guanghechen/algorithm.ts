import type { IDeepSearcherProps } from '../search/deep'
import { DeepSearcher } from '../search/deep'
import type { INarrowSearcherProps } from '../search/narrow'
import { NarrowSearcher } from '../search/narrow'
import type { IMinimaxSearcher, IMinimaxSearcherContext, IShapeScoreMap } from '../types'

export type INarrowSearchOption = Omit<INarrowSearcherProps, 'searchContext' | 'deeperSearcher'>
export type IDeepSearcherOption = Omit<IDeepSearcherProps, 'searchContext'>

interface IProps {
  narrowSearcherOptions: INarrowSearchOption[]
  deepSearcherOption: IDeepSearcherOption
  searchContext: IMinimaxSearcherContext
}

export const createMinimaxSearcher = (props: IProps): IMinimaxSearcher => {
  const { narrowSearcherOptions, deepSearcherOption, searchContext } = props
  const deepSearcher = new DeepSearcher({ ...deepSearcherOption, searchContext })
  let searcher = deepSearcher
  for (let i = narrowSearcherOptions.length - 1; i >= 0; --i) {
    const option = narrowSearcherOptions[i]
    const narrowSearcher = new NarrowSearcher({
      ...option,
      searchContext,
      deeperSearcher: searcher,
    })
    searcher = narrowSearcher
  }
  return searcher
}

export const createDefaultMinimaxSearcher = (
  scoreMap: Readonly<IShapeScoreMap>,
  searchContext: IMinimaxSearcherContext,
  options: {
    MAX_ADJACENT: number
    MIN_MULTIPLE_OF_TOP_SCORE: number
  },
): IMinimaxSearcher => {
  const { MAX_ADJACENT, MIN_MULTIPLE_OF_TOP_SCORE } = options
  const narrowSearcherOptions: INarrowSearchOption[] = [
    {
      MAX_SEARCH_DEPTH: 3,
      MAX_CANDIDATE_COUNT: 8,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 3][2] * 2,
      MIN_MULTIPLE_OF_TOP_SCORE,
    },
    {
      MAX_SEARCH_DEPTH: 5,
      MAX_CANDIDATE_COUNT: 4,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 2][1],
      MIN_MULTIPLE_OF_TOP_SCORE,
    },
    {
      MAX_SEARCH_DEPTH: 9,
      MAX_CANDIDATE_COUNT: 2,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 2][2] * 2,
      MIN_MULTIPLE_OF_TOP_SCORE,
    },
  ]
  const deepSearcherOption: IDeepSearcherOption = {
    MAX_SEARCH_DEPTH: 32,
    MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 1][1],
  }
  return createMinimaxSearcher({ narrowSearcherOptions, deepSearcherOption, searchContext })
}
