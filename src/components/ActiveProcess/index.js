import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Card, Collapse, Divider, Spin } from 'antd'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import style from './style.module.scss'

const { Panel } = Collapse

const Header = ({ status, providerDetail }) => {
  return (
    <div className="container-fluid p-2">
      <div className="row">
        <div className="col-md-auto">
          <div className="row pb-3">
            <div className="col-6">
              <h4>K8S Process</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-auto">
              <Card style={{ maxWidth: 300 }} bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}>
                <div>
                  <span>Provider IP : {providerDetail?.provider_ip}</span>
                </div>
              </Card>
            </div>
            <div className="col-md-auto">
              <Card style={{ maxWidth: 600 }} bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}>
                <div>
                  <span>Ingress Domain : {providerDetail?.ingress_domain}</span>
                </div>
              </Card>
            </div>
            <div className="col-md-auto">
              <Card style={{ maxWidth: 600 }} bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}>
                <div>
                  <span>Provider Domain : {providerDetail?.provider_domain}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div
          className="col"
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
        >
          {status === 'notStarted' && (
            <span>
              <ExclamationCircleOutlined style={{ fontSize: 20, color: 'gray' }} />
              <span style={{ fontWeight: 600, fontSize: 20, paddingLeft: 10 }}>Not Started</span>
            </span>
          )}
          {status === 'inProgress' && (
            <span>
              <SyncOutlined spin style={{ fontSize: 20, color: 'orange' }} />
              <span style={{ fontWeight: 600, fontSize: 20, paddingLeft: 10 }}>Installing</span>
            </span>
          )}
          {status === 'completed' && (
            <span>
              <CheckCircleFilled style={{ fontSize: 20, color: '#43A047' }} />
              <span style={{ fontWeight: 600, fontSize: 20, paddingLeft: 10 }}>Completed</span>
            </span>
          )}
          {status === 'error' && (
            <span>
              <CloseCircleFilled style={{ fontSize: 20, color: 'red' }} />
              <span style={{ fontWeight: 600, fontSize: 20, paddingLeft: 10 }}>Error Occured</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
const ActiveProcess = ({ activeProcess, dispatch }) => {
  useEffect(() => {
    dispatch({
      type: 'activeProcess/PROCESS_STATUS',
    })
  }, [dispatch])

  useEffect(() => {
    let interval = 0
    interval = setInterval(() => {
      dispatch({
        type: 'activeProcess/PROCESS_STATUS',
      })
    }, 10000)
    if (activeProcess.status === 'completed' || activeProcess.status === 'error') {
      clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [dispatch, activeProcess.status])

  const PraetorLogo = (
    <div className="initial__loading">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="75px"
        viewBox="0 0 75 75"
        height="75px"
        version="1.0"
      >
        <defs>
          <clipPath id="a">
            <path d="M 17 2.125 L 57 2.125 L 57 72.625 L 17 72.625 Z M 17 2.125" />
          </clipPath>
        </defs>
        <g clipPath="url(#a)">
          <path
            fill="#FF5722"
            d="M 55.808594 44.644531 C 55.808594 44.644531 51.523438 47.964844 55.273438 57.09375 C 55.273438 57.09375 56.613281 63.96875 43.484375 72.625 L 43.351562 66.816406 C 43.351562 66.816406 45.414062 63.324219 43.40625 60.183594 L 43.40625 50.226562 C 43.40625 50.226562 52.246094 47.90625 53.382812 42.28125 C 53.382812 42.28125 51.175781 38.195312 40.660156 44.476562 C 40.660156 44.476562 38.378906 44.953125 40.859375 52.894531 L 37.382812 57.964844 L 33.902344 52.894531 C 36.382812 44.953125 34.105469 44.476562 34.105469 44.476562 C 23.589844 38.195312 21.378906 42.28125 21.378906 42.28125 C 22.515625 47.90625 31.359375 50.226562 31.359375 50.226562 L 31.359375 60.183594 C 29.347656 63.324219 31.410156 66.816406 31.410156 66.816406 L 31.277344 72.625 C 18.148438 63.96875 19.488281 57.09375 19.488281 57.09375 C 23.238281 47.964844 18.953125 44.644531 18.953125 44.644531 C 13.773438 25.359375 28.925781 18.265625 35.019531 16.238281 C 34.675781 12.113281 33.707031 6 30.996094 2.332031 C 30.925781 2.234375 31.070312 2.125 31.167969 2.207031 C 32.105469 3.019531 33.660156 4.558594 34.496094 6.457031 C 34.496094 6.457031 34.988281 5.492188 35.609375 3.941406 C 36.246094 2.339844 38.515625 2.339844 39.152344 3.941406 C 39.773438 5.492188 40.269531 6.457031 40.269531 6.457031 C 41.101562 4.558594 42.65625 3.019531 43.59375 2.207031 C 43.691406 2.125 43.835938 2.234375 43.765625 2.332031 C 41.054688 6 40.085938 12.113281 39.742188 16.238281 C 45.835938 18.265625 60.988281 25.359375 55.808594 44.644531"
          />
        </g>
      </svg>
    </div>
  )

  return (
    <div className="container-full pt-5">
      <Spin spinning={activeProcess.loading} indicator={PraetorLogo}>
        <div className={`${style.active_process}`}>
          <div className="row">
            <div className="col-12 pl-3">
              <h3>
                <strong>Active Process</strong>
              </h3>
            </div>
          </div>
          <Divider />
          {activeProcess.stepName && (
            <div className="row">
              <div className="col-12">
                <Collapse expandIconPosition="right">
                  <Panel
                    header={
                      <Header
                        status={activeProcess.status}
                        providerDetail={activeProcess.providerDetail}
                      />
                    }
                    key="1"
                  >
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-12">
                          <strong>Pricing Details</strong>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 col-xs-12 col-sm-6 mt-2">
                          CPU Bid Price: {activeProcess.providerDetail.bid_price_cpu_scale}{' '}
                          uakt/millicpu
                        </div>
                        <div className="col-md-3 col-xs-12 col-sm-6 mt-2">
                          Memory Bid Price: {activeProcess.providerDetail.bid_price_memory_scale}{' '}
                          uakt/Mi
                        </div>
                        <div className="col-md-3 col-xs-12 col-sm-6 mt-2">
                          Storage Bid Price: {activeProcess.providerDetail.bid_price_storage_scale}{' '}
                          uakt/Mi
                        </div>
                        <div className="col-md-3 col-xs-12 col-sm-6 mt-2">
                          Endpoint Bid Price:{' '}
                          {activeProcess.providerDetail.bid_price_endpoint_scale} uakt/endpoint
                        </div>
                      </div>
                      <Divider />
                      <div className="row">
                        <div className="col-12">
                          <strong>Process</strong>
                        </div>
                      </div>
                      {activeProcess.processes.map((process, index) => {
                        return (
                          <div key={index} className="row">
                            <div className="col-12">
                              {process.status === 'Pending' && (
                                <div className={`row ${style.nodes_row}`}>
                                  <div className="col-12">
                                    <ExclamationCircleOutlined style={{ color: 'gray' }} /> &nbsp;
                                    {process.name}
                                  </div>
                                </div>
                              )}
                              {process.status === 'Processing' && (
                                <div className={`row ${style.nodes_row}`}>
                                  <div className="col-12">
                                    {activeProcess.status === 'inProgress' ? (
                                      <>
                                        <SyncOutlined spin style={{ color: 'orange' }} />
                                        &nbsp;
                                      </>
                                    ) : (
                                      <>
                                        <CloseCircleFilled style={{ color: 'red' }} />
                                        &nbsp;
                                      </>
                                    )}
                                    &nbsp;
                                    {process.name}
                                  </div>
                                </div>
                              )}
                              {process.status === 'Completed' && (
                                <div className={`row ${style.nodes_row}`}>
                                  <div className="col-12">
                                    <CheckCircleFilled style={{ color: '#43A047' }} /> &nbsp;
                                    {process.name}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </div>
          )}
        </div>
      </Spin>
    </div>
  )
}

const mapStateToProps = ({ activeProcess, dispatch }) => ({
  dispatch,
  activeProcess,
})

export default connect(mapStateToProps)(ActiveProcess)
