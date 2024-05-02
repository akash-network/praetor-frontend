import { all, put, takeLatest } from 'redux-saga/effects'
import actions from './actions'

export function* SELECT_CHAIN({ payload }) {
  yield put({
    type: 'chain/SET_STATE',
    payload: {
      selectedChain: payload.chainSelected,
    },
  })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.SELECT_CHAIN, SELECT_CHAIN)])
}
