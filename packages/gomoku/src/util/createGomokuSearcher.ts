import type { IDeepSearcherProps } from '../searcher/deep'
import { DeepSearcher } from '../searcher/deep'
import type { INarrowSearcherProps } from '../searcher/narrow'
import { NarrowSearcher } from '../searcher/narrow'
import type { IShapeScoreMap } from '../types/misc'
import type { IGomokuMover } from '../types/mover'
import type { IGomokuSearcher } from '../types/searcher'

export type INarrowSearchOption = Omit<INarrowSearcherProps, 'mover' | 'deeperSearcher'>
export type IDeepSearcherOption = Omit<IDeepSearcherProps, 'mover'>

interface IProps {
  narrowSearcherOptions: INarrowSearchOption[]
  deepSearcherOption: IDeepSearcherOption
  searchContext: IGomokuMover
}

export const createGomokuSearcher = (props: IProps): IGomokuSearcher => {
  const { narrowSearcherOptions, deepSearcherOption, searchContext } = props
  const deepSearcher = new DeepSearcher({ ...deepSearcherOption, mover: searchContext })
  let searcher = deepSearcher
  for (let i = narrowSearcherOptions.length - 1; i >= 0; --i) {
    const option = narrowSearcherOptions[i]
    const narrowSearcher = new NarrowSearcher({
      ...option,
      mover: searchContext,
      deeperSearcher: searcher,
    })
    searcher = narrowSearcher
  }
  return searcher
}

export const createDefaultGomokuSearcher = (
  scoreMap: Readonly<IShapeScoreMap>,
  searchContext: IGomokuMover,
  options: {
    MAX_ADJACENT: number
    CANDIDATE_GROWTH_FACTOR: number
  },
): IGomokuSearcher => {
  const { MAX_ADJACENT, CANDIDATE_GROWTH_FACTOR } = options
  const narrowSearcherOptions: INarrowSearchOption[] = [
    {
      MAX_SEARCH_DEPTH: 2,
      MAX_CANDIDATE_COUNT: 8,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 3][2] * 4,
      CANDIDATE_GROWTH_FACTOR,
    },
    {
      MAX_SEARCH_DEPTH: 4,
      MAX_CANDIDATE_COUNT: 4,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 2][1] * 2,
      CANDIDATE_GROWTH_FACTOR,
    },
    {
      MAX_SEARCH_DEPTH: 8,
      MAX_CANDIDATE_COUNT: 2,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 2][2] * 4,
      CANDIDATE_GROWTH_FACTOR,
    },
  ]
  const deepSearcherOption: IDeepSearcherOption = {
    MAX_SEARCH_DEPTH: 16,
    MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 1][1],
  }
  return createGomokuSearcher({ narrowSearcherOptions, deepSearcherOption, searchContext })
}
