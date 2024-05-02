import { Table, Button } from 'antd'
import React from 'react'
import { history } from 'index'
import { connect } from 'react-redux'
import style from './style.module.scss'

const ProviderPorts = ({ controlMachine, providerConfig, dispatch, chain, user }) => {
  const selectedChain = JSON.parse(chain.selectedChain)
  const onNext = () => {
    if (selectedChain.chainId === 'akashnet-2') {
      if (user.kubeBuild.type === 'k8s') {
        dispatch({
          type: 'dashboard/SET_STATE',
          payload: { showActiveProcess: true, showDashboard: false },
        })
      } else {
        dispatch({
          type: 'dashboard/SET_STATE',
          payload: { showActiveProcess: false, showDashboard: true },
        })
      }
      history.push('/dashboard')
    }
  }

  const dnsSource = [
    {
      key: 1,
      resource: 'Akash Machine',
      url: providerConfig.providerSettings.providerDomain,
      ipAddress: controlMachine.controlMachineIP,
    },
    {
      key: 2,
      resource: 'Ingress Machine',
      url: `*.${providerConfig.providerSettings.ingressDomain}`,
      ipAddress: controlMachine.ingressIP ? controlMachine.ingressIP : 'Ingress IP',
    },
  ]

  const dnsColumns = [
    {
      title: 'Record Name',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Value',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
  ]

  const dataSource = [
    {
      key: 1,
      resource: 'Control Machine',
      url: providerConfig.providerSettings.providerDomain,
      ipAddress: controlMachine.controlMachineIP,
      port: '8443',
    },
    {
      key: 2,
      resource: '',
      url: '',
      ipAddress: '',
      port: '8444',
    },
    {
      key: 3,
      resource: 'Ingress Machine',
      url: `*.${providerConfig.providerSettings.ingressDomain}`,
      ipAddress: controlMachine.controlMachineIP,
      port: '80',
    },

    {
      key: 5,
      resource: 'Ingress Machine',
      url: '',
      ipAddress: '',
      port: '443',
    },
    {
      key: 5,
      resource: '',
      url: '',
      ipAddress: '',
      port: '30000-32767',
    },
  ]

  const columns = [
    {
      title: 'Resources',
      dataIndex: 'resource',
      key: 'name',
      onCell: (_, index) => {
        if (index === 0) {
          return { rowSpan: 2 }
        }
        if (index === 2) {
          return { rowSpan: 3 }
        }
        return { rowSpan: 0 }
      },
    },
    {
      title: 'Url / Type',
      dataIndex: 'url',
      key: 'url',
      onCell: (_, index) => {
        if (index === 0) {
          return { rowSpan: 2 }
        }
        if (index === 2) {
          return { rowSpan: 3 }
        }
        return { rowSpan: 0 }
      },
    },
    {
      title: 'Port',
      dataIndex: 'port',
      key: 'port',
    },
  ]
  return (
    <div className="container-full">
      <div className={`${style.background}`}>
        <div className="row">
          <div className="d-none d-sm-none d-md-block col-md-4 col-lg-4 col-xl-4">
            <div className={`${style.background_white_img}`}>
              <div className="mt-5">
                <img
                  src="/resources/images/content/port_configuration.png"
                  height="350"
                  alt="Provider Port"
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
            <div className={`${style.background_white}`}>
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div>
                      <h2 className={`${style.h1}`}>Port & DNS Configurations</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${style.white_background} container`}>
                <div className="row">
                  <div className="col-12">
                    <h3>DNS Changes</h3>
                  </div>
                  <div className="col-12">
                    <Table
                      dataSource={dnsSource}
                      columns={dnsColumns}
                      bordered
                      pagination={{ position: ['none', 'none'] }}
                    />
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-12">
                    <h3>Ports Changes</h3>
                  </div>
                  <div className="col-12">
                    <Table
                      dataSource={dataSource}
                      columns={columns}
                      bordered
                      pagination={{ position: ['none', 'none'] }}
                    />
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <Button
                      onClick={() => onNext()}
                      size="large"
                      className={`ml-3 ${style.next_button}`}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ controlMachine, providerConfig, dispatch, chain, user }) => ({
  controlMachine,
  dispatch,
  providerConfig,
  chain,
  user,
})

export default connect(mapStateToProps)(ProviderPorts)
