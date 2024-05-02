import { notification } from 'antd'
import { JSEncrypt } from 'jsencrypt'
import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import getControlMachine from 'redux/control-machine/selector'
import Swal from 'sweetalert2'
import { importAkashWallet } from '../../services/user'
import actions from './actions'

const generticErrorMessage = 'Error Occurred, Please try again!'

const notifyError = (error = { message: generticErrorMessage }) => {
  notification.error({
    duration: 10,
    message: error.message,
  })
}

const overrideSeed = () => {
  const responsePayload = {
    walletImport: {
      seedOverride: false,
      changeSeedPhrase: false,
    },
  }
  return new Promise((resolve) => {
    Swal.fire({
      icon: 'question',
      title: 'Seed Phrase already exists!',
      showCancelButton: true,
      confirmButtonText: 'Override Seed phrase',
      cancelButtonText: 'Change Seed phrase',
      cancelButtonColor: '#cdcdcd',
      confirmButtonColor: '#ff7043',
      customClass: {
        cancelButton: 'swal-cncl-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        responsePayload.seedOverride = true
      } else {
        responsePayload.changeSeedPhrase = true
      }
      resolve(responsePayload)
    })
  })
}

export function* PRAETOR_IMPORT_WALLET({ payload }) {
  yield put({
    type: 'walletImport/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const controlMachine = yield select(getControlMachine)

  const crypt = new JSEncrypt()
  crypt.setPublicKey(controlMachine.publicKey)

  const encryptedSeed = crypt.encrypt(payload.seedPhrase)
  const encryptedPassword = crypt.encrypt(payload.password)

  // call backend api and submit the form, wait for reply

  const request = {
    session_id: controlMachine.sessionId,
    wallet_phrase: encryptedSeed,
    password: encryptedPassword,
    override_seed: payload.seedOverride,
    import_mode: 'auto',
  }

  const { response } = yield call(importAkashWallet, request)

  if (response && response.status === 'success') {
    notification.success({
      message: 'Success! Akash wallet imported!',
    })
    yield put({
      type: 'walletImport/SET_STATE',
      payload: {
        loading: false,
      },
    })
    yield put({
      type: 'user/SET_STATE',
      payload: {
        akashStep: 'providerSettings',
      },
    })
  } else if (response && response.status === 'error') {
    const { error } = response

    // If error code is P4090 then key exists
    if (error.error_code === 'P4090') {
      const responsePayload = yield call(overrideSeed)

      yield put({
        type: 'walletImport/SET_STATE',
        payload: responsePayload,
      })

      if (responsePayload.seedOverride) {
        payload.seedOverride = responsePayload.seedOverride
        yield call(PRAETOR_IMPORT_WALLET, { payload })
      }
    } else if (error.error_code === 'P5006') {
      yield call(
        () =>
          new Promise(() => {
            Swal.fire({
              icon: 'error',
              title: 'Seedphrase and connected account does not match',
              text: 'Please change the seed phrase or Log in using different account',
              confirmButtonColor: '#ff7043',
            })
          }),
        yield put({
          type: 'walletImport/SET_STATE',
          payload: {
            loading: false,
            changeSeedPhrase: true,
          },
        }),
      )
    } else if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }

    yield put({
      type: 'walletImport/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'walletImport/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* MANUAL_IMPORT_WALLET() {
  yield put({
    type: 'walletImport/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const controlMachine = yield select(getControlMachine)

  // call backend api and submit the form, wait for reply

  const request = {
    session_id: controlMachine.sessionId,
    import_mode: 'manual',
  }

  const { response } = yield call(importAkashWallet, request)

  if (response && response.status === 'success') {
    notification.success({
      message: 'Success! Akash wallet imported!',
    })
    yield put({
      type: 'walletImport/SET_STATE',
      payload: {
        loading: false,
      },
    })
    yield put({
      type: 'user/SET_STATE',
      payload: {
        akashStep: 'providerSettings',
      },
    })
  } else if (response && response.status === 'error') {
    const { error } = response

    if (error.error_code) {
      yield call(
        () =>
          new Promise(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error occured',
              text: `${error.message}`,
              confirmButtonColor: '#ff7043',
              confirmButtonText: 'Ok',
            })
          }),
        yield put({
          type: 'walletImport/SET_STATE',
          payload: {
            loading: false,
          },
        }),
      )
    }
  } else {
    notifyError()
    yield put({
      type: 'walletImport/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.PRAETOR_IMPORT_WALLET, PRAETOR_IMPORT_WALLET)])
  yield all([takeLatest(actions.MANUAL_IMPORT_WALLET, MANUAL_IMPORT_WALLET)])
}
