import { notification } from 'antd'
import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import { purgeStorage } from 'services/local-storage'
import getChain from 'redux/chain/selector'
import getResources from 'redux/resources/selector'
import { history } from 'index'
import {
  getProviderStatus,
  getNounce,
  verifySignature,
  createUser,
  refreshToken,
  removeSession,
} from '../../services/user'
import actions from './actions'

export function* WALLET_CONNECT({ payload }) {
  const { balance } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  let nextStep = 'walletConnect'
  const selectedChain = JSON.parse(yield select(getChain))
  const { response } = yield call(getProviderStatus, selectedChain.chainId)
  if (response && response.status === 'success') {
    const { data } = response
    const { provider, online: onlineStatus, active_process: activeProcess } = data
    if (activeProcess) {
      yield put({
        type: 'dashboard/SET_STATE',
        payload: {
          showActiveProcess: true,
          showDashboard: false,
        },
      })
      yield call(history.push, '/dashboard')
    } else if (provider) {
      if (onlineStatus) {
        nextStep = 'resources'
        yield put({
          type: 'user/SET_STATE',
          payload: {
            loading: false,
            connected: true,
            provider: {
              status: onlineStatus,
              data: provider,
            },
            balance: Number(balance),
          },
        })
        yield put({
          type: 'dashboard/SET_STATE',
          payload: {
            showDashboard: true,
          },
        })

        yield call(history.push, '/dashboard')
      } else if (!onlineStatus && Number(balance) >= 5000000) {
        nextStep = 'resources'
        yield put({
          type: 'user/SET_STATE',
          payload: {
            loading: false,
            connected: true,
            provider: {
              status: onlineStatus,
              data: provider,
            },
            balance: Number(balance),
          },
        })
        yield put({
          type: 'dashboard/SET_STATE',
          payload: {
            showDashboard: true,
          },
        })

        yield call(history.push, '/dashboard')
        // let responsePayload
        // yield call(
        //   () =>
        //     new Promise((resolve) => {
        //       Swal.fire({
        //         icon: 'error',
        //         title: 'Provider Not Online',
        //         text: 'Do you want to reinstall provider machine?',
        //         confirmButtonColor: '#ff7043',
        //         cancelButtonColor: '#cdcdcd',
        //         confirmButtonText: 'Reinstall Provider',
        //         showCancelButton: true,
        //       }).then((result) => {
        //         if (result.isConfirmed) {
        //           nextStep = 'kubeReady'
        //           responsePayload = {
        //             loading: false,
        //             connected: true,
        //             balance: Number(balance),
        //             akashStep: nextStep,
        //             provider: {
        //               status: onlineStatus,
        //               data: provider,
        //             },
        //           }
        //           history.push('/become-provider')
        //         } else {
        //           nextStep = 'walletConnect'
        //           responsePayload = {
        //             loading: false,
        //             connected: false,
        //             provider: {
        //               status: onlineStatus,
        //               data: provider,
        //             },
        //           }
        //         }
        //         resolve(responsePayload)
        //       })
        //     }),
        // )
        // yield put({
        //   type: 'user/SET_STATE',
        //   payload: responsePayload,
        // })
      } else {
        notifyError({
          message: "You don't have enough AKT balance to enable your provider machine!",
        })
        nextStep = 'walletConnect'
        yield put({
          type: 'user/SET_STATE',
          payload: {
            loading: false,
            connected: false,
          },
        })
      }
    } else if (!provider && Number(balance) >= 5000000) {
      nextStep = 'kubeReady'
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
          connected: true,
          provider: {
            status: onlineStatus,
            data: provider,
          },
          balance: Number(balance),
          akashStep: nextStep,
        },
      })
      yield call(history.push, '/become-provider')
    } else {
      notifyError({
        message: "You don't have enough AKT balance to enable your provider machine!",
      })
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
        },
      })
    }
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code) {
      notifyError(error)
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
        },
      })
    } else {
      notifyError()
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
        },
      })
    }
  } else {
    notifyError()
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

const callArbitrary = async (response, walletAddress, selectedChain) => {
  const { data } = response

  // Get Dynamic Url from hostname
  let url
  if (process.env.NODE_ENV === 'development') {
    url = 'app-dev.praetor.dev'
  } else {
    url = window.location.hostname
  }

  const arbitrary = await window.keplr
    .signArbitrary(
      selectedChain.chainId,
      walletAddress,
      `${url} wants you to sign in with your Keplr account - ${walletAddress} using Nonce - ${data.nonce}`,
    )
    .catch((error) => {
      console.log('Error happened', error)
    })

  if (arbitrary) {
    return {
      payload: {
        signer: walletAddress,
        ...arbitrary,
      },
    }
  }

  return false
}

export function* NOUNCE({ payload }) {
  const selectedChain = JSON.parse(yield select(getChain))

  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const { response } = yield call(getNounce, payload)
  if (response && response.status === 'success') {
    // If response is success then we have nonce, let's call arbitrary signin and send this to get JWT
    const jwtRequest = yield call(callArbitrary, response, payload.walletAddress, selectedChain)

    if (jwtRequest) {
      yield call(VERIFY_SIGNATURE, jwtRequest, payload.balance, payload.walletAddress)
    } else {
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
        },
      })
    }
  } else if (response && response.status === 'error') {
    // If there is error and error is N4040 in this call, let's call create user
    const { error } = response
    if (error.code === 'N4040') {
      // Creating User with createUser api
      const createUserResponse = yield call(createUser, {
        address: payload.walletAddress,
      })
      if (createUserResponse.response && createUserResponse.response.status === 'success') {
        // We got nonce, let's call arbitrary jwt call
        const jwtRequest = yield call(
          callArbitrary,
          createUserResponse.response,
          payload.walletAddress,
          selectedChain,
        )

        if (jwtRequest) {
          yield call(VERIFY_SIGNATURE, jwtRequest, payload.balance, payload.walletAddress)
        } else {
          yield put({
            type: 'user/SET_STATE',
            payload: {
              loading: false,
            },
          })
        }
      } else if (createUserResponse.response && createUserResponse.response.status === 'error') {
        notifyError(error.code ? error.code : null)
      } else {
        notifyError()
      }
    } else {
      notifyError(error.code ? error.code : null)
    }
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
        akashStep: 'walletConnect',
      },
    })
  }
}

export function* VERIFY_SIGNATURE({ payload }, balance, walletAddress) {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const { response } = yield call(verifySignature, payload)
  if (response && response.status === 'success') {
    const { data } = response

    localStorage.setItem('walletAddress', walletAddress)
    localStorage.setItem('accessToken', data.access_token)
    localStorage.setItem('refreshToken', data.refresh_token)

    yield call(WALLET_CONNECT, { payload: { balance, walletAddress } })
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOGOUTUSER({ payload }) {
  const resources = yield select(getResources)

  const object = {
    session_id: resources?.providerDetails?.session_id,
  }

  if (resources?.providerDetails?.session_id && payload.value === 'authorized') {
    const { response } = yield call(removeSession, object)

    if (response && response.status === 'success') {
      purgeStorage()
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
          connected: false,
          balance: null,
          refeshing: false,
          provider: {
            data: false,
            status: false,
          },
          akashStep: 'walletConnect',
        },
      })
      yield call(history.push, '/auth/login')
    }
  } else {
    if (payload.value === 'unauthorized') {
      notification.warning({
        message: 'You have been logged out the Praetor Platfom. Please login again!',
      })
    }
    purgeStorage()
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
        connected: false,
        balance: null,
        refeshing: false,
        provider: {
          data: false,
          status: false,
        },
        akashStep: 'walletConnect',
      },
    })

    yield call(history.push, '/auth/login')
  }
}

export function* REFRESH({ payload }) {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      refreshing: true,
    },
  })
  const request = {
    refresh_token: payload.refreshToken,
    address: localStorage.getItem('walletAddress'),
  }

  const { response } = yield call(refreshToken, request)

  const { status } = response
  if (response && status === 'success') {
    const { data } = response
    localStorage.setItem('accessToken', data.access_token)
    localStorage.setItem('refreshToken', data.refresh_token)
    yield put({
      type: 'user/SET_STATE',
      payload: {
        refreshing: false,
      },
    })
  } else if (response && response.status === 'error') {
    yield call(LOGOUTUSER, { payload: { value: 'unauthorized' } })
  } else {
    yield call(LOGOUTUSER, { payload: { value: 'unauthorized' } })
    notifyError()
  }
}

export function* START_OVER() {
  yield call(history.push, '/auth/login')
}

const generticErrorMessage = 'Error Occurred, Please try again!'

const notifyError = (error = { message: generticErrorMessage }) => {
  notification.error({
    duration: 10,
    message: error.message,
  })
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.WALLET_CONNECT, WALLET_CONNECT),
    takeLatest(actions.GET_NOUNCE, NOUNCE),
    takeLatest(actions.VERIFY_SIGNATURE, VERIFY_SIGNATURE),
    takeLatest(actions.LOGOUTUSER, LOGOUTUSER),
    takeLatest(actions.REFRESH, REFRESH),
    takeLatest(actions.START_OVER, START_OVER),
  ])
}
