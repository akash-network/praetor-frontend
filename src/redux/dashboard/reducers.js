import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  showActiveProcess: false,
  showDashboard: false,
}

export default function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
