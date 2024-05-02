import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  loading: false,
  keyFile: null,
  passphrase: null,
  commonUsername: null,
  commonPassword: null,
  nodes: [],
}

export default function nodeAccessReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
