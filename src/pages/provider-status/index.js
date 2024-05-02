import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import ProviderStatus from 'components/ProviderStatus'

const ProviderStatusPage = () => {
  return (
    <div>
      <Helmet title="Provider Status" />
      <ProviderStatus />
    </div>
  )
}

const mapStateToProps = ({ user }) => ({
  user,
})

export default connect(mapStateToProps)(ProviderStatusPage)
