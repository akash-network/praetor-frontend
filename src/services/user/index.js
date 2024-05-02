import restClient from 'services/axios/restClient'
import authClient from 'services/axios/authClient'

export async function verifyControlMachineAccess(payload) {
  return restClient
    .post('ssh', payload, { 'Content-Type': 'application/json' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function importAkashWallet(payload) {
  return restClient
    .post('wallet', payload, { 'Content-Type': 'application/json' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function becomeProvider(payload) {
  return restClient
    .post('provider', payload, { 'Content-Type': 'multipart/form-data' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getSessionStatus(payload) {
  return restClient
    .get(`session/${payload.sessionId}/${payload.eventType}`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getProviderStatus(chainId) {
  return restClient
    .get(`provider/status?chainid=${chainId}`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getDashboardData(chainId) {
  return restClient
    .get(`dashboard?chainid=${chainId}`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getNounce(payload) {
  return authClient
    .get(`users/nonce/${payload.walletAddress}`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function verifySignature(payload) {
  return authClient
    .post('auth/verify', payload, { 'Content-Type': 'application/json' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function createUser(payload) {
  return authClient
    .post('users', payload, { 'Content-Type': 'application/json' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function refreshToken(payload) {
  return authClient
    .post('auth/refresh', payload, { 'Content-Type': 'application/json' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function installK8S(payload) {
  return restClient
    .post('k8s', payload, { 'Content-Type': 'multipart/form-data' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getActiveProcessStatus() {
  return restClient
    .get(`dashboard/active-process`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getBidResources(payload) {
  return restClient
    .post('/provider/resources', payload, { 'Content-Type': 'application/json' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}
export async function checkSessionExist(sessionId) {
  return restClient
    .get(`/dashboard/session/${sessionId}`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}
export async function getCurrentPrices(sessionId) {
  return restClient
    .get(`/dashboard/provider-bid-price/${sessionId}`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getPersistentStorageDrives(payload) {
  return restClient
    .get(`persistent-storage/${payload.sessionId}`)
    .then((response) => ({ driveResponse: response }))
    .catch(() => {
      return { response: false }
    })
}

export async function updateProviderPrices(payload) {
  return restClient
    .post('/dashboard/provider-bid-price', payload, { 'Content-Type': 'application/json' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getControlMachineAccess(payload) {
  return restClient
    .post('/dashboard/control-machine', payload, { 'Content-Type': 'multipart/form-data' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function setPersistentStorage(payload) {
  return restClient
    .post(`/persistent-storage`, payload, {
      'Content-Type': 'application/json',
    })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getProviderNote() {
  return restClient
    .get(`dashboard/provider-note`)
    .then((providerNoteResponse) => ({ providerNoteResponse }))
    .catch(() => {
      return { response: false }
    })
}

export async function setProviderNote(payload) {
  return restClient
    .post(`dashboard/provider-note`, payload, {
      'Content-Type': 'application/json',
    })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function updateProviderEvent(payload) {
  return restClient
    .post('/dashboard/provider-event', payload, { 'Content-Type': 'application/json' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function deleteProviderNote() {
  return restClient
    .delete('dashboard/provider-note')
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getProviderVersion(sessionId) {
  return restClient
    .get(`/dashboard/version?session_id=${sessionId}`)
    .then((currVersionResponse) => ({ currVersionResponse }))
    .catch(() => {
      return { response: false }
    })
}

export async function upgradeProviderVersion(payload) {
  return restClient
    .post(`/dashboard/version`, payload, { 'Content-Type': 'application/json' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function restartProvider(sessionId) {
  return restClient
    .get(`/dashboard/restart/${sessionId}`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function removeSession(payload) {
  return restClient
    .post(`/dashboard/logout`, payload, { 'Content-Type': 'application/json' })
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}
