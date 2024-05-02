import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  loading: false,
  stepName: null,
  description: null,
  status: null,
  processes: [],
  providerDetail: null,
}

export default function activeProcessReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
