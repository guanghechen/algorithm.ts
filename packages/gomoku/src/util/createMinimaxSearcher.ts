import type { IDeepSearcherProps } from '../searcher/deep'
import { DeepSearcher } from '../searcher/deep'
import type { INarrowSearcherProps } from '../searcher/narrow'
import { NarrowSearcher } from '../searcher/narrow'
import type { IShapeScoreMap } from '../types/misc'
import type { IGomokuSearcher } from '../types/searcher'
import type { IGomokuSearcherContext } from '../types/searcher-context'

export type INarrowSearchOption = Omit<INarrowSearcherProps, 'searcherContext' | 'deeperSearcher'>
export type IDeepSearcherOption = Omit<IDeepSearcherProps, 'searcherContext'>

interface IProps {
  narrowSearcherOptions: INarrowSearchOption[]
  deepSearcherOption: IDeepSearcherOption
  searchContext: IGomokuSearcherContext
}

export const createMinimaxSearcher = (props: IProps): IGomokuSearcher => {
  const { narrowSearcherOptions, deepSearcherOption, searchContext } = props
  const deepSearcher = new DeepSearcher({ ...deepSearcherOption, searcherContext: searchContext })
  let searcher = deepSearcher
  for (let i = narrowSearcherOptions.length - 1; i >= 0; --i) {
    const option = narrowSearcherOptions[i]
    const narrowSearcher = new NarrowSearcher({
      ...option,
      searcherContext: searchContext,
      deeperSearcher: searcher,
    })
    searcher = narrowSearcher
  }
  return searcher
}

export const createDefaultMinimaxSearcher = (
  scoreMap: Readonly<IShapeScoreMap>,
  searchContext: IGomokuSearcherContext,
  options: {
    MAX_ADJACENT: number
    MIN_MULTIPLE_OF_TOP_SCORE: number
  },
): IGomokuSearcher => {
  const { MAX_ADJACENT, MIN_MULTIPLE_OF_TOP_SCORE } = options
  const narrowSearcherOptions: INarrowSearchOption[] = [
    {
      MAX_SEARCH_DEPTH: 3,
      MAX_CANDIDATE_COUNT: 8,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 3][2] * 4,
      MIN_MULTIPLE_OF_TOP_SCORE,
    },
    {
      MAX_SEARCH_DEPTH: 5,
      MAX_CANDIDATE_COUNT: 4,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 2][1] * 2,
      MIN_MULTIPLE_OF_TOP_SCORE,
    },
    {
      MAX_SEARCH_DEPTH: 11,
      MAX_CANDIDATE_COUNT: 2,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 2][2] * 4,
      MIN_MULTIPLE_OF_TOP_SCORE,
    },
  ]
  const deepSearcherOption: IDeepSearcherOption = {
    MAX_SEARCH_DEPTH: 24,
    MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 1][1],
  }
  return createMinimaxSearcher({ narrowSearcherOptions, deepSearcherOption, searchContext })
}
