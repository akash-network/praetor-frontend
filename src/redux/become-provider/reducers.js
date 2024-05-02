import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  loading: false,
  process: 0,
  progress: {
    description: '',
    percentage: 0,
  },
}

export default function becomingProviderReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
