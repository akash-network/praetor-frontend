import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Divider, Skeleton } from 'antd'
import { history } from 'index'
import PieCharts from '@vb/widgets/WidgetsCharts/PieChart'
import style from './style.module.scss'

const Resources = ({ dispatch, resources }) => {
  React.useEffect(() => {
    dispatch({
      type: 'resources/GET_SERVER_INFO',
    })
  }, [dispatch])

  const reinstallProvider = () => {
    const nextStep = 'kubeReady'
    const responsePayload = {
      akashStep: nextStep,
    }
    dispatch({
      type: 'user/SET_STATE',
      payload: responsePayload,
    })
    history.push('/become-provider')
  }

  return (
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
        <div className="continer-fluid">
          <div className="row mt-5">
            <div className="col-11">
              <h3 className="mb-3">
                <strong>Resources</strong>
              </h3>
            </div>
          </div>
          <Divider />
          <div className="row mt-4">
            <div className="col-12">
              <div className="row">
                <div className="col-md-auto mt-3 col-sm-12">
                  <Card>
                    <PieCharts
                      title="CPU"
                      subtitle="Current CPU usage"
                      formatBytes={false}
                      formatType="vCPUs"
                      resourceData={[
                        { name: 'Active', value: resources.providerDetails.active_resources.cpu },
                        {
                          name: 'Pending',
                          value: resources.providerDetails.pending_resources.cpu,
                        },
                        {
                          name: 'Available',
                          value: resources.providerDetails.available_resources.cpu,
                        },
                      ]}
                    />
                  </Card>
                </div>
                <div className="col-md-auto mt-3 col-sm-12">
                  <Card>
                    <PieCharts
                      title="Memory"
                      subtitle="Current Memory"
                      resourceData={[
                        {
                          name: 'Active',
                          value: resources.providerDetails.active_resources.memory,
                        },
                        {
                          name: 'Pending',
                          value: resources.providerDetails.pending_resources.memory,
                        },
                        {
                          name: 'Available',
                          value: resources.providerDetails.available_resources.memory,
                        },
                      ]}
                    />
                  </Card>
                </div>
                <div className="col-md-auto mt-3 col-sm-12">
                  <Card>
                    <PieCharts
                      title="Ephemeral Storage"
                      subtitle="Current Ephemeral Storage"
                      resourceData={[
                        {
                          name: 'Active',
                          value: resources.providerDetails.active_resources.storage_ephemeral,
                        },
                        {
                          name: 'Pending',
                          value: resources.providerDetails.pending_resources.storage_ephemeral,
                        },
                        {
                          name: 'Available',
                          value: resources.providerDetails.available_resources.storage_ephemeral,
                        },
                      ]}
                    />
                  </Card>
                </div>
                {resources.providerDetails.storage_class && (
                  <div className="col-md-auto mt-3 col-sm-12">
                    <Card>
                      <PieCharts
                        title="Persistent Storage"
                        subtitle="Current Persistent Storage"
                        resourceData={[
                          {
                            name: 'Active',
                            value: resources.providerDetails.active_resources.storage,
                          },
                          {
                            name: 'Pending',
                            value: resources.providerDetails.pending_resources.storage,
                          },
                          {
                            name: 'Available',
                            value: resources.providerDetails.available_resources.storage,
                          },
                        ]}
                      />
                    </Card>
                  </div>
                )}
                {resources.providerDetails.active_resources.gpu +
                  resources.providerDetails.pending_resources.gpu +
                  resources.providerDetails.available_resources.gpu !==
                  0 && (
                  <div className="col-md-auto mt-3 col-sm-12">
                    <Card>
                      <PieCharts
                        title="GPU"
                        subtitle="Current GPU usage"
                        formatBytes={false}
                        formatType="GPU"
                        resourceData={[
                          {
                            name: 'Active',
                            value: resources.providerDetails.active_resources.gpu,
                          },
                          {
                            name: 'Pending',
                            value: resources.providerDetails.pending_resources.gpu,
                          },
                          {
                            name: 'Available',
                            value: resources.providerDetails.available_resources.gpu,
                          },
                        ]}
                      />
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {!resources.providerDetails && !resources.loading && (
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="col-12">
              <h4 className="mb-3">Sorry, your provider is offline.</h4>
              <Divider />
              <div>
                <strong>Common Issues regarding this</strong>
              </div>
              <div>
                <ul>
                  <li>
                    Port forwarding is not complete. <br />
                    Please make sure you have completed required port forwarding. <br />
                    Common error occured when 8443 port is not forwarded to your provder control
                    machine.
                  </li>
                  <li>
                    DNS Resolution Issue <br />
                    Try to check if DNS propogation using this{' '}
                    <a href="https://www.whatsmydns.net/" target="_blank" rel="noreferrer">
                      site
                    </a>{' '}
                    make sure your domain forwarding is correct.
                  </li>
                  <li>
                    Provider setup is incomplete or had issue setting provider. Please reinstall
                    provider using below link.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Button
                onClick={() => reinstallProvider()}
                size="large"
                className={`${style.reinstall_button}`}
              >
                Reinstall Provider
              </Button>
            </div>
          </div>
        </div>
      )}
      <Divider />
    </div>
  )
}

const mapStateToProps = ({ resources, dispatch, chain }) => ({
  dispatch,
  resources,
  chain,
})

export default connect(mapStateToProps)(Resources)
