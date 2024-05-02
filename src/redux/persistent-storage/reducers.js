import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  loading: false,
  drives: [],
  storage: {
    type: null,
    class: null,
  },
  activeDrives: [],
  enabled: false,
}

export default function persistentStorageReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
