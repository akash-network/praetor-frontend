import { notification } from 'antd'
import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import getUser from 'redux/user/selector'
import getChain from 'redux/chain/selector'
import Swal from 'sweetalert2'
import { verifyControlMachineAccess } from '../../services/user'
import actions from './actions'

const generticErrorMessage = 'Error Occurred, Please try again!'

const notifyError = (error = { message: generticErrorMessage }) => {
  notification.error({
    duration: 10,
    message: error.message,
  })
}

export function* CHECK_ACCESS({ payload }) {
  // Set Loading true for control machine screen to load

  const user = yield select(getUser)

  yield put({
    type: 'controlMachine/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const selectedChain = JSON.parse(yield select(getChain))

  // Constructing form data object.

  const formdata = new FormData()

  formdata.append('host_name', payload.hostname)
  formdata.append('port', payload.port)
  formdata.append('user_name', payload.username)
  formdata.append('kube_build', JSON.stringify(user.kubeBuild))
  formdata.append('ssh_mode', payload.sshMode)
  formdata.append('chainid', selectedChain.chainId)

  // if (selectedChain.chainId === process.env.REACT_APP_TESTNET_CHAIN_ID) {
  formdata.append('gpu_enabled', payload.gpu)
  formdata.append('gpu_type', payload.gpuType ? payload.gpuType : null)
  formdata.append('gpu_model', payload.gpuModel ? payload.gpuModel : null)
  // }

  if (!user.kubeBuild.status) {
    formdata.append('kube_file', payload.uploadFile.fileList[0].originFileObj)
    formdata.append('install_akash', payload.installAkash)
  }
  if (payload.sshMode === 'file') {
    formdata.append('key_file', payload.keyFile.fileList[0].originFileObj)
    formdata.append('passphrase', payload.passphrase)
  } else if (payload.sshMode === 'password') {
    formdata.append('password', payload.password)
  }

  if (user.kubeBuild.type === 'k8s') {
    yield put({
      type: 'nodeAccess/SET_STATE',
      payload: {
        controlMachineIncluded: payload.controlMachineIncluded,
      },
    })
  }

  // Call API for verification
  const { response } = yield call(verifyControlMachineAccess, formdata)
  if (response && response.status === 'success') {
    const { data } = response

    // SET GPU values here

    yield put({
      type: 'controlMachine/SET_STATE',
      payload: {
        loading: false,
        sessionId: data.session_id,
        publicKey: data.public_key,
        controlMachineIP: payload.hostname,
        username: payload.username,
        gpu: payload.gpu,
        gpuType: payload.gpuType,
      },
    })

    if (user.kubeBuild.status) {
      if (user.kubeBuild.type === 'k8s') {
        yield put({
          type: 'user/SET_STATE',
          payload: {
            akashStep: 'nodeAccess',
          },
        })
        yield put({
          type: 'controlMachine/SET_STATE',
          payload: {
            ingressIP: payload.controlMachineIncluded ? payload.hostname : null,
          },
        })
      } else if (user.kubeBuild.type === 'k3s') {
        yield put({
          type: 'user/SET_STATE',
          payload: {
            akashStep: 'installingK3S',
          },
        })
        yield put({
          type: 'controlMachine/SET_STATE',
          payload: {
            ingressIP: payload.hostname,
          },
        })
      }
    } else {
      yield put({
        type: 'user/SET_STATE',
        payload: {
          akashStep: 'akashWalletImport',
        },
      })
      yield put({
        type: 'controlMachine/SET_STATE',
        payload: {
          ingressIP: null,
        },
      })
    }
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code === 'P50110') {
      Swal.fire({
        icon: 'error',
        text: error.message,
        footer:
          '<a href="https://docs.praetorapp.com/akash-provider/sudo-user-requirements" target="_blank">How to resolve this error?</a>',
      })
    } else if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'controlMachine/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'controlMachine/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.CHECK_ACCESS, CHECK_ACCESS)])
}
