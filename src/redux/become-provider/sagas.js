import { notification } from 'antd'
import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import getControlMachine from 'redux/control-machine/selector'
import { history } from 'index'
import { getSessionStatus } from '../../services/user'
import actions from './actions'

export function* PROVIDER_STATUS(payload) {
  if (!payload) {
    yield put({
      type: 'becomingProvider/SET_STATE',
      payload: {
        akashStep: 'walletConnect',
      },
    })
  }

  const controlMachine = yield select(getControlMachine)
  const request = {
    sessionId: controlMachine.sessionId,
    eventType: 'provider',
  }
  if (controlMachine.sessionId) {
    const { response } = yield call(getSessionStatus, request)
    if (response && response.status === 'success') {
      const { data } = response
      if (data.process.percentage < 0) {
        yield put({
          type: 'becomingProvider/SET_STATE',
          payload: {
            progress: {
              description: data.process.description,
              percentage: 0,
            },
          },
        })
        history.push('/processing-error')
      }
      if (data.process.percentage === 100) {
        yield put({
          type: 'user/SET_STATE',
          payload: {
            akashStep: 'congratulations',
          },
        })

        yield put({
          type: 'becomingProvider/SET_STATE',
          payload: {
            progress: {
              description: '',
              percentage: 0,
            },
          },
        })
      } else {
        yield put({
          type: 'becomingProvider/SET_STATE',
          payload: {
            progress: {
              description: data.process.description,
              percentage: data.process.percentage,
            },
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
        type: 'becomingProvider/SET_STATE',
        payload: {
          loading: false,
        },
      })
    } else {
      notifyError()
      yield put({
        type: 'becomingProvider/SET_STATE',
        payload: {
          loading: false,
        },
      })
    }
  }
}

export function* INSTALL_K3S_STATUS() {
  const controlMachine = yield select(getControlMachine)
  const request = {
    sessionId: controlMachine.sessionId,
    eventType: 'k3s',
  }
  if (controlMachine.sessionId) {
    const { response } = yield call(getSessionStatus, request)
    if (response && response.status === 'success') {
      const { data } = response
      if (data.process.percentage < 0) {
        yield put({
          type: 'becomingProvider/SET_STATE',
          payload: {
            progress: {
              description: data.process.description,
              percentage: 0,
            },
          },
        })
        history.push('/processing-error')
      }
      if (data.process.percentage === 100) {
        yield put({
          type: 'user/SET_STATE',
          payload: {
            akashStep: 'akashWalletImport',
          },
        })
        yield put({
          type: 'becomingProvider/SET_STATE',
          payload: {
            progress: {
              description: '',
              percentage: 0,
            },
          },
        })
      } else {
        yield put({
          type: 'becomingProvider/SET_STATE',
          payload: {
            progress: {
              description: data.process.description,
              percentage: data.process.percentage,
            },
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
        type: 'becomingProvider/SET_STATE',
        payload: {
          loading: false,
        },
      })
    } else {
      notifyError()
      yield put({
        type: 'becomingProvider/SET_STATE',
        payload: {
          loading: false,
        },
      })
    }
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
  yield all([takeLatest(actions.PROVIDER_STATUS, PROVIDER_STATUS)])
  yield all([takeLatest(actions.INSTALL_K3S_STATUS, INSTALL_K3S_STATUS)])
}
