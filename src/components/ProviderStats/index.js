import React from 'react'
import { connect } from 'react-redux'
import { Card, Divider, Skeleton } from 'antd'
import style from './style.module.scss'

const ProviderStats = ({ resources, user }) => {
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
            <div className="row">
              <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                <Card style={{ minWidth: 200 }}>
                  <div>
                    <Skeleton.Input active />
                  </div>
                </Card>
              </div>
              <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                <Card style={{ minWidth: 200 }}>
                  <div>
                    <Skeleton.Input active />
                  </div>
                </Card>
              </div>
              <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                <Card style={{ minWidth: 200 }}>
                  <div>
                    <Skeleton.Input active />
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
        {!resources.loading && resources.providerDetails && (
          <>
            <div className="row mt-5">
              <div className="col-12">
                <h3 className="mb-3">
                  <strong>Provider State</strong>
                </h3>
              </div>
            </div>
            <Divider />
            <div className="row">
              <div className="col mt-3">
                <Card style={{ minWidth: 200 }} title="Active Leases">
                  <div>
                    <div className={`${style.attributes_font}`}>
                      <strong>{resources.providerDetails.leases}</strong>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="col mt-3">
                <Card style={{ minWidth: 200 }} title="Orders">
                  <div>
                    <div className={`${style.attributes_font}`}>
                      <strong>{resources.providerDetails.orders}</strong>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="col mt-3">
                <Card style={{ minWidth: 200 }} title="Deployments">
                  <div>
                    <div className={`${style.attributes_font}`}>
                      <strong>{resources.providerDetails.deployments}</strong>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="col mt-3">
                <Card style={{ minWidth: 200 }} title="Cluster Name">
                  <div>
                    <div className={`${style.attributes_font}`}>
                      <strong>{resources.providerDetails.cluster_public_hostname}</strong>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <h5 className="mb-3">
                  NOTE: Maximum number of new deployments you can host is
                  <strong> {Math.floor(user.balance / (1000000 * 0.5))} </strong>, based on your
                  current AKT balance
                </h5>
              </div>
            </div>
            <Divider />
          </>
        )}
      </div>
    </>
  )
}

const mapStateToProps = ({ resources, dispatch, user }) => ({
  dispatch,
  resources,
  user,
})

export default connect(mapStateToProps)(ProviderStats)
