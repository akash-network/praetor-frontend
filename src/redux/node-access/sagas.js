import { notification } from 'antd'
import { all, takeLatest, select, call, put } from 'redux-saga/effects'
import getControlMachine from 'redux/control-machine/selector'
import { getPersistentStorageDrives, installK8S } from '../../services/user'
import actions from './actions'
import getNodeDetails from './selector'

const generticErrorMessage = 'Error Occurred, Please try again!'

const notifyError = (error = { message: generticErrorMessage }) => {
  notification.error({
    duration: 10,
    message: error.message,
  })
}

export function* NODE_ACCESS({ payload }) {
  // Set Loading true for control machine screen to load

  const nodeDetails = yield select(getNodeDetails)
  const controlMachine = yield select(getControlMachine)

  if (payload.sameUsername) {
    payload.nodes.forEach((node) => {
      node.username = nodeDetails.commonUsername
    })
  }
  if (payload.samePassword) {
    payload.nodes.forEach((node) => {
      node.password = nodeDetails.commonPassword
    })
  }

  // Constructing form data object.

  const formdata = new FormData()

  if (payload.keyFileAccess) {
    payload.keyfile = nodeDetails.keyfile
    formdata.append('key_file', nodeDetails.keyFile.fileList[0].originFileObj)
  }
  formdata.append('control_machine_included', nodeDetails.controlMachineIncluded)
  formdata.append('session_id', controlMachine.sessionId)
  formdata.append('nodes', JSON.stringify(payload.nodes))
  formdata.append('passphrase', nodeDetails.passphrase)

  // Call API for verification
  yield put({
    type: 'nodeAccess/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { response } = yield call(installK8S, formdata)
  if (response && response.status === 'success') {
    const {
      data: { node_connection: nodeConnection, ingress_ip: ingressIP },
    } = response
    yield put({
      type: 'nodeAccess/SET_STATE',
      payload: {
        loading: false,
        nodes: nodeConnection,
      },
    })
    yield put({
      type: 'controlMachine/SET_STATE',
      payload: {
        ingressIP,
      },
    })

    // Check if persistent storage drives are avaialble
    // If we get drives from backend then make akashStep persistentStorage otherwise akashWalletImport

    const { driveResponse } = yield call(getPersistentStorageDrives, controlMachine)

    if (driveResponse && driveResponse.status === 'success') {
      const {
        data: { drives },
      } = driveResponse

      yield put({
        type: 'persistentStorage/SET_STATE',
        payload: {
          drives,
        },
      })
      yield put({
        type: 'user/SET_STATE',
        payload: {
          akashStep: 'persistentStorage',
        },
      })
    } else {
      yield put({
        type: 'nodeAccess/SET_STATE',
        payload: {
          drives: [],
        },
      })
      yield put({
        type: 'user/SET_STATE',
        payload: {
          akashStep: 'persistentStorage',
        },
      })
    }
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code === 'P50023') {
      const {
        message: { node_connection: nodeConnection },
      } = error
      yield put({
        type: 'nodeAccess/SET_STATE',
        payload: {
          loading: false,
          nodes: nodeConnection,
        },
      })
      notifyError({ message: 'Error Connecting Nodes.' })
    } else {
      yield put({
        type: 'nodeAccess/SET_STATE',
        payload: {
          loading: false,
          nodes: [],
        },
      })
      notifyError()
    }
  } else {
    notifyError()
    yield put({
      type: 'nodeAccess/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.NODE_ACCESS, NODE_ACCESS)])
}
