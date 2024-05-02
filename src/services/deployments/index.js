import restClient from 'services/axios/restClient'

export async function getProviderDeployments(offset, limit, status) {
  return restClient
    .get(`/deployment/list/${offset}/${limit}/${status}`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getLatestBlock() {
  return restClient
    .get(`/deployment/latest/block`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}

export async function getDeploymentDetails(owner, dseq) {
  return restClient
    .get(`/deployment/details/${owner}/${dseq}`)
    .then((response) => ({ response }))
    .catch(() => {
      return { response: false }
    })
}
