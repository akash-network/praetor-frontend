import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  loading: false,
  sessionId: null,
  publicKey: null,
  controlMachineIP: null,
  ingressIP: null,
  username: null,
}

export default function controlMachineReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
