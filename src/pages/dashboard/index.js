import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import Resources from 'components/Resources'
import ActiveProcess from 'components/ActiveProcess'
import ProviderStats from 'components/ProviderStats'

const Dashboard = ({ dashboard }) => {
  return (
    <div>
      <Helmet title="Dashboard" />
      {dashboard.showActiveProcess && <ActiveProcess className="mt-3" />}
      {dashboard.showDashboard && (
        <>
          <ProviderStats />
          <Resources />
        </>
      )}
    </div>
  )
}

const mapStateToProps = ({ dashboard }) => ({
  dashboard,
})

export default connect(mapStateToProps)(Dashboard)
