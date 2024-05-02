import { notification } from 'antd'
import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import getChain from 'redux/chain/selector'
import Swal from 'sweetalert2'
import {
  checkSessionExist,
  getControlMachineAccess,
  getCurrentPrices,
  getDashboardData,
  updateProviderPrices,
  getProviderNote,
  setProviderNote,
  deleteProviderNote,
  restartProvider,
  getProviderVersion,
  upgradeProviderVersion,
  updateProviderEvent,
} from '../../services/user'

import actions from './actions'
import getResources from './selector'

export function* GET_SERVER_INFO() {
  const resources = yield select(getResources)

  if (!resources.providerDetails) {
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: true,
      },
    })
  }

  const { providerNoteResponse } = yield call(getProviderNote)

  if (providerNoteResponse && providerNoteResponse.status === 'success') {
    const { data } = providerNoteResponse
    if (data.provider_note) {
      yield put({
        type: 'resources/SET_STATE',
        payload: {
          providerNote: {
            message: data.provider_note.message,
            startTime: data.provider_note.start_time,
            endTime: data.provider_note.end_time,
          },
        },
      })
    }
  }

  const selectedChain = JSON.parse(yield select(getChain))

  const { response } = yield call(getDashboardData, selectedChain.chainId)

  if (response && response.status === 'success') {
    const { data } = response

    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
        providerDetails: data,
        priceLoading: true,
      },
    })

    if (data.session_id) {
      const sessionExist = yield call(checkSessionExist, data.session_id)
      const {
        response: {
          data: { valid_session: validSession },
        },
      } = sessionExist

      if (validSession) {
        yield put({
          type: 'resources/SET_STATE',
          payload: {
            loading: true,
          },
        })
        const { currVersionResponse } = yield call(getProviderVersion, data.session_id)
        if (currVersionResponse && currVersionResponse.status === 'success') {
          const { data: versionData } = currVersionResponse
          yield put({
            type: 'resources/SET_STATE',
            payload: {
              loading: false,
              versions: {
                providerVersion: versionData.provider_version,
                systemVersion: versionData.system_latest_version,
                versionUpgradable: versionData.version_upgradable,
              },
            },
          })
        }
        yield put({
          type: 'resources/SET_STATE',
          payload: {
            loading: false,
          },
        })
      }

      const currentPrices = yield call(getCurrentPrices, data.session_id)
      if (currentPrices.response) {
        const {
          response: {
            data: { bid_price_data: bidPriceData },
          },
        } = currentPrices
        yield put({
          type: 'resources/SET_STATE',
          payload: {
            priceLoading: false,
            sessionExist: validSession,
            currentPrices: bidPriceData,
          },
        })
      } else {
        yield put({
          type: 'resources/SET_STATE',
          payload: {
            priceLoading: false,
            sessionExist: validSession,
          },
        })
      }
    }
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* UPDATE_PRICES({ payload }) {
  yield put({
    type: 'resources/SET_STATE',
    payload: {
      processLoading: true,
      processUpdated: false,
    },
  })

  const resources = yield select(getResources)

  const request = {
    session_id: resources.providerDetails.session_id,
    bid_price_cpu_scale: payload.values.cpuInput,
    bid_price_memory_scale: payload.values.memoryInput,
    bid_price_storage_scale: payload.values.storageInput,
    bid_price_endpoint_scale: payload.values.bidPriceEndpointScale,
    bid_price_hd_pres_hdd_scale: payload.values.persistentStorageHDDInput,
    bid_price_hd_pres_ssd_scale: payload.values.persistentStorageSSDInput,
    bid_price_hd_pres_nvme_scale: payload.values.persistentStorageNVMEInput,
    bid_price_ip_scale: payload.values.ipScaleInput ? payload.values.ipScaleInput : 5,
    bid_price_gpu_scale: payload.values.gpuScaleInput ? payload.values.gpuScaleInput : 100,
    bid_deposit: `${payload.values.bidDeposit}uakt`,
    attributes: payload.attributes,
  }

  const { response } = yield call(updateProviderPrices, request)

  if (response && response.status === 'success') {
    const currentPrices = yield call(getCurrentPrices, resources.providerDetails.session_id)
    const {
      response: {
        data: { bid_price_data: bidPriceData },
      },
    } = currentPrices
    const { data } = response
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        currentPrices: bidPriceData,
        sessionUpdated: false,
        processLoading: false,
        processUpdated: true,
      },
    })
    notification.success({ message: data })
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: true,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: true,
      },
    })
  }
}

export function* UPDATE_SESSION({ payload }) {
  yield put({
    type: 'resources/SET_STATE',
    payload: {
      sessionLoading: true,
      sessionUpdated: false,
    },
  })

  const resources = yield select(getResources)

  const providerData = resources.providerDetails

  const formdata = new FormData()

  formdata.append('host_name', payload.values.hostname)
  formdata.append('port', payload.values.port)
  formdata.append('user_name', payload.values.username)
  formdata.append('ssh_mode', payload.values.sshMode)
  if (payload.values.sshMode === 'file') {
    formdata.append('key_file', payload.values.keyFile.fileList[0].originFileObj)
    formdata.append('passphrase', payload.values.passphrase)
  } else if (payload.values.sshMode === 'password') {
    formdata.append('password', payload.values.password)
  }

  const { response } = yield call(getControlMachineAccess, formdata)

  if (response && response.status === 'success') {
    const { data } = response
    providerData.session_id = data.session_id

    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
        providerDetails: providerData,
        sessionExist: true,
        sessionLoading: false,
        sessionUpdated: true,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
        sessionLoading: false,
      },
    })
  }
}

export function* SET_PROVIDER_NOTES({ payload }) {
  yield put({
    type: 'resources/SET_STATE',
    payload: {
      processLoading: true,
      processUpdated: false,
    },
  })

  const request = {
    message: payload.message,
    start_time: payload.startTime.utc().unix(),
    end_time: payload.endTime.utc().unix(),
  }

  const { response } = yield call(setProviderNote, request)

  if (response && response.status === 'success') {
    const { data } = response
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
        providerNote: {
          message: payload.message,
          startTime: payload.startTime.utc().unix(),
          endTime: payload.endTime.utc().unix(),
        },
        processUpdated: true,
      },
    })
    notification.success({ message: data })
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
      },
    })
  }
}

export function* UPDATE_URL({ payload }) {
  yield put({
    type: 'resources/SET_STATE',
    payload: {
      processLoading: true,
      processUpdated: false,
    },
  })

  const resources = yield select(getResources)

  const request = {
    session_id: resources.providerDetails.session_id,
    attributes: resources.providerDetails.provider_attributes.attributes,
    domain_name: payload.values.providerDomain,
    modify_event: 'domain',
  }

  const { response } = yield call(updateProviderEvent, request)

  if (response && response.status === 'success') {
    const { data } = response
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
        processUpdated: true,
      },
    })

    const { providerDetails } = resources
    const providerData = providerDetails
    providerData.cluster_public_hostname = payload.values.providerDomain
    providerData.provider_attributes.host_uri = [
      'https://',
      payload.values.providerDomain,
      ':8443',
    ].join('')
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        providerDetails: providerData,
      },
    })
    yield call(GET_PROVIDER_VERSION)
    notification.success({ message: data })
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code === 'P50029') {
      Swal.fire({
        icon: 'error',
        title: 'DNS Resolution Failed!',
        text: error.message,
        confirmButtonColor: '#ff7043',
      })
    } else if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
        processLoading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
        processLoading: false,
      },
    })
  }
}

export function* DELETE_PROVIDER_NOTE() {
  yield put({
    type: 'resources/SET_STATE',
    payload: {
      processLoading: true,
    },
  })

  const { response } = yield call(deleteProviderNote)

  if (response && response.status === 'success') {
    const { data } = response
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
        providerNote: data.provider_note,
        processUpdated: true,
      },
    })
    notification.success({ message: data })
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
      },
    })
  }
}

export function* UPGRADE_PROVIDER_VERSION() {
  const resources = yield select(getResources)

  yield put({
    type: 'resources/SET_STATE',
    payload: {
      processLoading: true,
    },
  })

  const request = {
    session_id: resources.providerDetails.session_id,
    provider_version: resources.versions.providerVersion,
  }

  const { response } = yield call(upgradeProviderVersion, request)

  if (response && response.status === 'success') {
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        versions: {
          providerVersion: response.data.provider_version,
          systemVersion: response.data.system_latest_version,
          versionUpgradable: response.data.version_upgradable,
        },
        processLoading: false,
      },
    })
    notification.success({
      message: `Provider Version upgrade process started. Please check back in 15 minutes.`,
    })
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
      },
    })
  }
}

export function* RESTART_PROVIDER() {
  const resources = yield select(getResources)

  yield put({
    type: 'resources/SET_STATE',
    payload: {
      processLoading: true,
    },
  })

  const { response } = yield call(restartProvider, resources.providerDetails.session_id)

  if (response && response.status === 'success') {
    const { data } = response
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
        sessionUpdated: false,
      },
    })
    notification.success({ message: data })
    yield call(GET_PROVIDER_VERSION)
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        processLoading: false,
      },
    })
  }
}

export function* UPDATE_ATTRIBUTES({ payload }) {
  yield put({
    type: 'resources/SET_STATE',
    payload: {
      processLoading: true,
    },
  })

  const resources = yield select(getResources)

  const request = {
    session_id: resources.providerDetails.session_id,
    attributes: payload.attributes,
    domain_name: resources.providerDetails?.cluster_public_hostname.substring(9),
    modify_event: 'attributes',
  }

  const { response } = yield call(updateProviderEvent, request)

  if (response && response.status === 'success') {
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
        processLoading: false,
        sessionUpdated: false,
        processUpdated: true,
      },
    })
    yield call(GET_PROVIDER_VERSION)
  } else if (response && response.status === 'error') {
    const { error } = response
    if (error.error_code) {
      notifyError(error)
    } else {
      notifyError()
    }
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
        processLoading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
        processLoading: false,
      },
    })
  }
}

// Temporary created this method
export function* GET_PROVIDER_VERSION() {
  const resources = yield select(getResources)

  if (resources?.sessionExist) {
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: true,
      },
    })
    const { currVersionResponse } = yield call(
      getProviderVersion,
      resources?.providerDetails?.session_id,
    )
    if (currVersionResponse && currVersionResponse.status === 'success') {
      const { data: versionData } = currVersionResponse
      yield put({
        type: 'resources/SET_STATE',
        payload: {
          loading: false,
          versions: {
            providerVersion: versionData.provider_version,
            systemVersion: versionData.system_latest_version,
            versionUpgradable: versionData.version_upgradable,
          },
        },
      })
    }
    yield put({
      type: 'resources/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

// Error Notification
const generticErrorMessage = 'Error Occurred, Please try again!'
const notifyError = (error = { message: generticErrorMessage }) => {
  notification.error({
    duration: 10,
    message: error.message,
  })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.GET_SERVER_INFO, GET_SERVER_INFO)])
  yield all([takeLatest(actions.SET_PROVIDER_NOTES, SET_PROVIDER_NOTES)])
  yield all([takeLatest(actions.UPDATE_PRICES, UPDATE_PRICES)])
  yield all([takeLatest(actions.UPDATE_SESSION, UPDATE_SESSION)])
  yield all([takeLatest(actions.UPDATE_URL, UPDATE_URL)])
  yield all([takeLatest(actions.DELETE_PROVIDER_NOTE, DELETE_PROVIDER_NOTE)])
  yield all([takeLatest(actions.UPGRADE_PROVIDER_VERSION, UPGRADE_PROVIDER_VERSION)])
  yield all([takeLatest(actions.RESTART_PROVIDER, RESTART_PROVIDER)])
  yield all([takeLatest(actions.UPDATE_ATTRIBUTES, UPDATE_ATTRIBUTES)])
  yield all([takeLatest(actions.GET_PROVIDER_VERSION, GET_PROVIDER_VERSION)])
}
