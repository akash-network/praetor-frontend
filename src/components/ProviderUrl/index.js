import React from 'react'
import { connect } from 'react-redux'
import UpdateProviderURL from 'components/UpdateProviderURL'
import { Button, Card, Divider, Skeleton, Tooltip } from 'antd'
import style from './style.module.scss'

const ProviderUrl = ({ showDrawer, setDrawer, onSessionOpen, resources }) => {
  const updatePrice = () => {
    onSessionOpen()
  }

  const formatClusterURL = (clusterIp) => {
    if (clusterIp.startsWith('provider.')) {
      return clusterIp.substring(9)
    }
    return clusterIp
  }

  return (
    <>
      <div className={`${style.container}`}>
        {resources.loading && (
          <>
            <div className="row mt-5 mb-3">
              <div className="col-12">
                <h3 className="mb-3">
                  <Skeleton.Input active />
                </h3>
              </div>
            </div>
          </>
        )}
        {!resources.loading && (
          <>
            <div className="row mt-5">
              <div className="col-12">
                <h3 className="mb-3">
                  <strong>Domain Name</strong>
                </h3>
              </div>
            </div>
            <Divider />
            <div className="row">
              <div className="col mt-3">
                <Card style={{ minWidth: 200 }} title="URL">
                  <div className={`${style.attributes_font}`}>
                    <div>
                      {formatClusterURL(resources.providerDetails?.cluster_public_hostname)}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <>
              <div className="row mt-4">
                <div className="col-12">
                  <Tooltip
                    placement="topLeft"
                    title={
                      !resources.providerDetails?.session_id &&
                      'Only Praetor Providers have access to this feature!'
                    }
                  >
                    <Button
                      type="primary"
                      onClick={() => updatePrice()}
                      disabled={!resources.providerDetails?.session_id}
                    >
                      Edit URL
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <UpdateProviderURL showDrawer={showDrawer} onCloseDrawer={() => setDrawer(false)} />
              <Divider />
            </>
          </>
        )}
      </div>
    </>
  )
}

const mapStateToProps = ({ resources, dispatch }) => ({
  dispatch,
  resources,
})

export default connect(mapStateToProps)(ProviderUrl)
