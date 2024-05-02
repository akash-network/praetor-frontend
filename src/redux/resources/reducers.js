import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  loading: false,
  providerDetails: null,
  sessionExist: false,
  priceLoading: false,
  sessionLoading: false,
  sessionUpdated: false,
  processLoading: false,
  processUpdated: false,
}

export default function resourcesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
