import { notification } from 'antd'
import { all, takeLatest, call, select, put } from 'redux-saga/effects'
import getControlMachine from 'redux/control-machine/selector'
import { getPersistentStorageDrives, setPersistentStorage } from '../../services/user'
import actions from './actions'

const generticErrorMessage = 'Error Occurred, Please try again!'

const notifyError = (error = { message: generticErrorMessage }) => {
  notification.error({
    duration: 10,
    message: error.message,
  })
}

export function* GET_DRIVES() {
  yield put({
    type: 'persistentStorage/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const controlMachine = yield select(getControlMachine)
  const { driveResponse } = yield call(getPersistentStorageDrives, controlMachine)

  if (driveResponse && driveResponse.status === 'success') {
    const {
      data: { drives },
    } = driveResponse

    if (drives.length === 0) {
      notifyError({ message: 'No Drive found' })
    }
    yield put({
      type: 'persistentStorage/SET_STATE',
      payload: {
        drives,
        loading: false,
      },
    })
  } else if (driveResponse && driveResponse.status === 'error') {
    yield put({
      type: 'persistentStorage/SET_STATE',
      payload: {
        loading: false,
        drives: [],
      },
    })
    notifyError()
  } else {
    notifyError()
    yield put({
      type: 'persistentStorage/SET_STATE',
      payload: {
        loading: false,
        drives: [],
      },
    })
  }
}

export function* SET_DRIVES({ payload }) {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const controlMachine = yield select(getControlMachine)
  payload.session_id = controlMachine.sessionId
  const { response } = yield call(setPersistentStorage, payload)

  if (response && response.status === 'success') {
    const {
      data: { storage_class: storageClass, storage_type: storageType },
    } = response
    yield put({
      type: 'persistentStorage/SET_STATE',
      payload: {
        loading: false,
        storage: {
          type: storageType,
          class: storageClass,
        },
        activeDrives: payload.drives,
        enabled: true,
      },
    })
    yield put({
      type: 'user/SET_STATE',
      payload: {
        akashStep: 'akashWalletImport',
      },
    })
  } else if (response && response.status === 'error') {
    yield put({
      type: 'persistentStorage/SET_STATE',
      payload: {
        loading: false,
      },
    })
    notifyError()
  } else {
    notifyError()
    yield put({
      type: 'persistentStorage/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.GET_DRIVES, GET_DRIVES)])
  yield all([takeLatest(actions.SET_DRIVES, SET_DRIVES)])
}
