import React from 'react'
import { connect } from 'react-redux'
import KubeReady from 'components/KubeReady'
import { Helmet } from 'react-helmet'
import ControlMachine from 'components/ControlMachineAccess'
import AkashWalletImport from 'components/AkashWalletImport'
import Congratulations from 'components/Congratulations'
import AkashKubernetesGuide from 'components/AkashKubernetesGuide'
import ProviderSettings from 'components/ProviderSettings'
import BecomingProvider from 'components/BecomingProvider'
import ErrorComponent from 'components/ErrorComponent'
import Resources from 'components/Resources'
import ProviderPorts from 'components/ProviderPorts'
import NodeAccess from 'components/NodeAccess'
import PersistentStorage from 'components/PersistentStorage'

const BecomeProvider = ({ user }) => {
  const allRoutes = {
    kubeReady: KubeReady,
    controlMachine: ControlMachine,
    akashWalletImport: AkashWalletImport,
    installingK3S: BecomingProvider,
    congratulations: Congratulations,
    providerPorts: ProviderPorts,
    akashKubernetesGuide: AkashKubernetesGuide,
    providerSettings: ProviderSettings,
    akashProvider: BecomingProvider,
    resources: Resources,
    nodeAccess: NodeAccess,
    persistentStorage: PersistentStorage,
  }
  const RenderComponent = allRoutes[user.akashStep]
  const convertText = (text) => {
    return (
      text
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, (str) => {
          return str.toUpperCase()
        })
    )
  }
  return (
    <div>
      <Helmet title={`On-Boarding | ${convertText(user.akashStep)}`} />
      {RenderComponent && <RenderComponent />}
      {!RenderComponent && <ErrorComponent />}
    </div>
  )
}

const mapStateToProps = ({ user }) => ({
  user,
})

export default connect(mapStateToProps)(BecomeProvider)
