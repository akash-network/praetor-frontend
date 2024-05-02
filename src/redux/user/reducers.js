import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  loading: false,
  connected: false,
  balance: null,
  provider: {
    data: false,
    status: false,
  },
  refreshing: false,
  kubeBuild: {
    status: false,
    type: null,
  },
  akashStep: 'walletConnect',
  activeProcess: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
