import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  loading: false,
  bidResources: {
    cpu: null,
    memory: null,
    storage: null,
  },
}

export default function providerConfigReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
