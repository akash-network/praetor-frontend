import { notification } from 'antd'
import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import getControlMachine from 'redux/control-machine/selector'
import getNodeDetails from 'redux/node-access/selector'
import getUser from 'redux/user/selector'
import { becomeProvider, getBidResources } from '../../services/user'
import actions from './actions'

export function* BECOME_PROVIDER({ payload }) {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const controlMachine = yield select(getControlMachine)
  const user = yield select(getUser)

  if (payload.providerAttributes.attributes) {
    payload.providerAttributes.attributes.unshift({
      key: 'organization',
      value: payload.organizationName,
    })
  } else {
    payload.providerAttributes.attributes = []
    payload.providerAttributes.attributes.push({
      key: 'organization',
      value: payload.organizationName,
    })
  }

  const request = {
    session_id: controlMachine.sessionId,
    attributes: payload.providerAttributes.attributes,
    // ingress_domain: payload.ingressDomain,
    // provider_domain: payload.providerDomain,
    domain_name: payload.domainName,
    bid_price_cpu_scale: payload.bidEngine.cpuInput,
    bid_price_memory_scale: payload.bidEngine.memoryInput,
    bid_price_storage_scale: payload.bidEngine.storageInput,
    bid_price_endpoint_scale: payload.bidEngine.bidPriceEndpointScale,
    persistent_price: payload.bidEngine.persistentStorageInput,
    persistent_type: payload.bidEngine.storageType,
    bid_price_ip_scale: payload.bidEngine.bidPriceIpScale ? payload.bidEngine.bidPriceIpScale : 5,
    bid_price_gpu_scale: payload.bidEngine.bidPriceGPUScale
      ? payload.bidEngine.bidPriceGPUScale
      : 100,
    bid_deposit: `${payload.bidEngine.bidDeposit}uakt`,
    update: payload.update,
  }

  const { response } = yield call(becomeProvider, request)

  if (response && response.status === 'success') {
    notification.success({
      message: 'Success! Process Started',
    })

    yield put({
      type: 'providerConfig/SET_STATE',
      payload: {
        loading: false,
        providerSettings: {
          providerDomain: payload.providerDomain,
          organizationName: payload.organizationName,
          ingressDomain: payload.ingressDomain,
        },
      },
    })

    if (user.kubeBuild.type === 'k8s') {
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
          akashStep: 'providerPorts',
        },
      })
    } else {
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
          akashStep: 'akashProvider',
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
      type: 'providerConfig/SET_STATE',
      payload: {
        loading: false,
      },
    })
  } else {
    notifyError()
    yield put({
      type: 'providerConfig/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* BID_ENGINE_CUSTOMIZATION() {
  const controlMachine = yield select(getControlMachine)
  const nodeDetails = yield select(getNodeDetails)
  const user = yield select(getUser)

  let request

  if (user.kubeBuild.type === 'k8s') {
    request = {
      session_id: controlMachine.sessionId,
      kube_type: user.kubeBuild.type,
      passphrase: nodeDetails.passphrase,
      nodes: nodeDetails.nodes,
      control_machine_included: nodeDetails.controlMachineIncluded,
      ssh_mode: controlMachine.sshMode,
    }
  } else {
    request = {
      session_id: controlMachine.sessionId,
      kube_type: user.kubeBuild.type,
    }
  }

  const { response } = yield call(getBidResources, request)
  if (response && response.status === 'success') {
    const {
      data: { resources },
    } = response
    yield put({
      type: 'providerConfig/SET_STATE',
      payload: {
        bidResources: resources,
      },
    })
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

// Error Notification
const generticErrorMessage = 'Error Occurred, Please try again!'
const notifyError = (error = { message: generticErrorMessage }) => {
  notification.error({
    duration: 10,
    message: error.message,
  })
}

export default function* rootSaga() {
  yield all([takeLatest(actions.BECOME_PROVIDER, BECOME_PROVIDER)])
  yield all([takeLatest(actions.BID_ENGINE_CUSTOMIZATION, BID_ENGINE_CUSTOMIZATION)])
}
