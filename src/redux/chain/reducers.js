import { PURGE } from 'redux-persist'
import actions from './actions'

const initialState = {
  selectedChain: JSON.stringify({
    chainId: 'akashnet-2',
    chainName: 'Akash',
    rpc: process.env.REACT_APP_RPC_URL,
    experimental: false,
    rest: null,
  }),
}

export default function chainReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case PURGE:
      return initialState
    default:
      return state
  }
}
