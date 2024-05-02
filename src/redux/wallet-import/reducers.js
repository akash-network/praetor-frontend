import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  loading: false,
  seedOverride: false,
  changeSeedPhrase: false,
}

export default function walletImportReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
