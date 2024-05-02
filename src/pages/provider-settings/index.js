import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import ProviderAttributes from 'components/ProviderAttributes'
import ProviderPricing from 'components/ProviderPricing'
import UpdateSession from 'components/UpdateSession'
import ProviderUrl from 'components/ProviderUrl'
import ProviderNote from 'components/ProviderNote'
import { Divider } from 'antd'
import ProviderVersion from 'components/ProviderVersion'

const ProviderSettings = ({ dispatch, resources, dashboard }) => {
  const [showSessionDrawer, setShowSessionDrawer] = useState(false)
  const [showPricingDrawer, setShowPricingDrawer] = useState(false)
  const [showProviderUrlDrawer, setShowProviderUrlDrawer] = useState(false)
  const [showAttributesDrawer, setShowAttributesDrawer] = useState(false)
  const [drawerName, setDrawerName] = useState(null)

  React.useEffect(() => {
    dispatch({
      type: 'resources/GET_SERVER_INFO',
    })
  }, [dispatch])

  const closeSessionDrawer = (flag) => {
    setShowSessionDrawer(false)
    if (drawerName && flag) {
      openDrawer(drawerName)
    }
  }

  const openDrawer = (drawer) => {
    switch (drawer) {
      case 'pricing':
        setShowPricingDrawer(true)
        break
      case 'providerUrl':
        setShowProviderUrlDrawer(true)
        break
      case 'attributes':
        setShowAttributesDrawer(true)
        break
      default:
        break
    }
  }

  const openSession = (drawer) => {
    if (!resources?.sessionExist) {
      setDrawerName(drawer)
      setShowSessionDrawer(true)
    } else {
      openDrawer(drawer)
    }
  }
  return (
    <div>
      <Helmet title="Provider Settings" />
      {!dashboard.showDashboard && (
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="col-12">
              <h4 className="mb-3">Active Process is running.</h4>
              <Divider />
              <div>
                <strong>
                  Please wait until your Active Process gets completed. Provider Settings screen
                  will get updated after completion of Active Process
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
      {dashboard.showDashboard && (
        <>
          <ProviderVersion drawerName={drawerName} onSessionOpen={() => openSession('version')} />
          <ProviderAttributes
            showDrawer={showAttributesDrawer}
            setDrawer={() => setShowAttributesDrawer(false)}
            onSessionOpen={() => openSession('attributes')}
          />
          <ProviderPricing
            showDrawer={showPricingDrawer}
            setDrawer={() => setShowPricingDrawer(false)}
            onSessionOpen={() => openSession('pricing')}
          />
          <ProviderUrl
            showDrawer={showProviderUrlDrawer}
            setDrawer={() => setShowProviderUrlDrawer(false)}
            onSessionOpen={() => openSession('providerUrl')}
          />
          <ProviderNote />
          <UpdateSession
            showDrawer={showSessionDrawer}
            closeSessionDrawer={(flag) => closeSessionDrawer(flag)}
          />
        </>
      )}
    </div>
  )
}

const mapStateToProps = ({ dashboard, resources }) => ({
  dashboard,
  resources,
})

export default connect(mapStateToProps)(ProviderSettings)
