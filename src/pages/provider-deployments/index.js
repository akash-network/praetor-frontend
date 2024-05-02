import DeploymentDetails from 'components/DeploymentDetails'
import ProviderDeployments from 'components/ProviderDeployments'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router-dom'

const Deployments = () => {
  const { pathname } = useLocation()
  return (
    <div>
      <Helmet title="Provider Deployments" />
      {pathname?.split('/')[2] ? <DeploymentDetails /> : <ProviderDeployments />}
    </div>
  )
}

export default Deployments
