import { notification } from 'antd'
import { all, takeLatest, put, call } from 'redux-saga/effects'
import { getActiveProcessStatus } from '../../services/user'
import actions from './actions'

export function* ACTIVE_PROCESS_STATUS() {
  const { response } = yield call(getActiveProcessStatus)
  if (response && response.status === 'success') {
    const {
      data: {
        step_name: stepName,
        description,
        percentage,
        processes,
        provider_detail: providerDetail,
      },
    } = response
    if (percentage === -1) {
      yield put({
        type: 'activeProcess/SET_STATE',
        payload: {
          loading: false,
          stepName,
          description,
          processes,
          status: 'error',
          providerDetail,
        },
      })
    } else if (percentage === 100) {
      yield put({
        type: 'activeProcess/SET_STATE',
        payload: {
          loading: false,
          stepName,
          description,
          processes,
          status: 'completed',
          providerDetail,
        },
      })
      yield put({
        type: 'dashboard/SET_STATE',
        payload: {
          showDashboard: true,
        },
      })
    } else if (percentage < 100 && percentage > 0) {
      yield put({
        type: 'activeProcess/SET_STATE',
        payload: {
          loading: false,
          stepName,
          description,
          processes,
          status: 'inProgress',
          providerDetail,
        },
      })
    } else if (percentage === 0) {
      yield put({
        type: 'activeProcess/SET_STATE',
        payload: {
          loading: false,
          stepName,
          description,
          processes,
          status: 'notStarted',
          providerDetail,
        },
      })
    }
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'activeProcess/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'activeProcess/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

const generticErrorMessage = 'Error Occurred, Please try again!'

const notifyError = (error = { message: generticErrorMessage }) => {
  notification.error({
    duration: 10,
    message: error.message,
  })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.ACTIVE_PROCESS_STATUS, ACTIVE_PROCESS_STATUS)])
}
