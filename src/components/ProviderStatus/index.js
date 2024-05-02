import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  NotificationFilled,
  NotificationOutlined,
} from '@ant-design/icons'
import WorldMapStatus from 'components/WorldMapStatus'
import ResourcesChart from '@vb/widgets/WidgetsCharts/ResourcesChart'
import copy from 'copy-to-clipboard'
import { history } from 'index'
import { cloneDeep } from 'lodash'
import { Card, Divider, Select, Table, Tabs, Tooltip } from 'antd'
import { useLocation } from 'react-router-dom'
import style from './style.module.scss'
import 'antd/dist/antd.css'

const { TabPane } = Tabs

const redAkashLogo = '/resources/images/logo/akash.svg'

const ProviderStatus = () => {
  const [data, setData] = useState(null)
  const [activeProviders, setActiveProviders] = useState(null)
  const [inActiveProviders, setInActiveProviders] = useState(null)
  const [search, setSearch] = useState(null)
  const [activeTab, setActiveTab] = useState('1')
  const [activeNetworkUsage, setActiveNetworkUsage] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
  })
  const [pendingNetworkUsage, setPendingNetworkUsage] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
  })
  const [availableNetworkUsage, setAvailableNetworkUsage] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
  })
  const location = useLocation()

  const [chainSelected, setChainSelected] = useState('akashnet-2')

  const setRawData = (res) => {
    setData(res.data)
    let tmpAvailableCPU = 0
    let tmpPendingCPU = 0
    let tmpActiveCPU = 0
    let tmpAvailableMemory = 0
    let tmpPendingMemory = 0
    let tmpActiveMemory = 0
    let tmpAvailablePersistentStorage = 0
    let tmpPendingPersistentStorage = 0
    let tmpActivePersistentStorage = 0
    let tmpAvailableEphemeralStorage = 0
    let tmpPendingEphemeralStorage = 0
    let tmpActiveEphemeralStorage = 0
    let tmpAvailableGPU = 0
    let tmpPendingGPU = 0
    let tmpActiveGPU = 0

    res.data.providers.active_providers.forEach((provider) => {
      tmpActiveCPU += provider.active_resources.cpu
      tmpActiveMemory += provider.active_resources.memory
      tmpActivePersistentStorage += provider.active_resources.storage
      tmpActiveGPU += provider.active_resources.gpu
      tmpActiveEphemeralStorage += provider.active_resources.storage_ephemeral

      tmpPendingCPU += provider.pending_resources.cpu
      tmpPendingMemory += provider.pending_resources.memory
      tmpPendingPersistentStorage += provider.pending_resources.storage
      tmpPendingGPU += provider.pending_resources.gpu
      tmpPendingEphemeralStorage += provider.pending_resources.storage_ephemeral

      tmpAvailableCPU += provider.available_resources.cpu
      tmpAvailableMemory += provider.available_resources.memory
      tmpAvailablePersistentStorage += provider.available_resources.storage
      tmpAvailableGPU += provider.available_resources.gpu
      tmpAvailableEphemeralStorage += provider.available_resources.storage_ephemeral
    })
    setActiveNetworkUsage({
      cpu: tmpActiveCPU.toFixed(2),
      memory: tmpActiveMemory,
      ephemeralStorage: tmpActiveEphemeralStorage,
      persistentStorage: tmpActivePersistentStorage,
      gpu: tmpActiveGPU,
    })
    setAvailableNetworkUsage({
      cpu: tmpAvailableCPU.toFixed(2),
      memory: tmpAvailableMemory,
      ephemeralStorage: tmpAvailableEphemeralStorage,
      persistentStorage: tmpAvailablePersistentStorage,
      gpu: tmpAvailableGPU,
    })
    setPendingNetworkUsage({
      cpu: tmpPendingCPU.toFixed(2),
      memory: tmpPendingMemory,
      ephemeralStorage: tmpPendingEphemeralStorage,
      persistentStorage: tmpPendingPersistentStorage,
      gpu: tmpPendingGPU,
    })
  }

  const changeChain = (val) => {
    history.push({
      pathname: 'provider-status',
      search: `?chainid=${val}`,
    })
    setChainSelected(val)
    fetch(`${process.env.REACT_APP_BACKEND_URL}/list-providers?chainid=${val}`)
      .then((response) => response.json())
      .then((res) => {
        setRawData(res)
      })
  }

  const activeColumns = [
    {
      title: 'Name',
      dataIndex: 'cluster_public_hostname',
      key: 'cluster_public_hostname',
      render: (text, index) => {
        return (
          <>
            {index.praetor && (
              <div className={`${style.praetorShortLogo}`}>
                <span className="mr-1">{text}</span>
                <span>
                  <Tooltip title="Created using Praetor App">
                    <img
                      src="/resources/images/logo/red_short_40.png"
                      height="auto"
                      width={20}
                      alt="praetor logo"
                    />
                  </Tooltip>
                </span>
                {index.provider_note && (
                  <span>
                    <Tooltip className="ml-2" title="There is a message from the provider">
                      <NotificationFilled style={{ color: '#FFA726' }} />
                    </Tooltip>
                  </span>
                )}
              </div>
            )}
            {!index.praetor && (
              <>
                <span>{text}</span>
                {index.provider_note && (
                  <span>
                    <Tooltip className="ml-2" title="There is a message from the provider">
                      <NotificationFilled style={{ color: '#FFA726' }} />
                    </Tooltip>
                  </span>
                )}
              </>
            )}
          </>
        )
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text) => {
        return (
          <div className={`${style.copyToClipboard}`}>
            <span>
              {`${text.substring(0, 3)}...${text.substring(text.length - 5, text.length)}`}
            </span>
            <span className={`${style.copyToClipboardSpan}`}>
              <CopyOutlined onClick={() => copy(text)} />
            </span>
          </div>
        )
      },
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      render: (_, index) => {
        return (
          <div>
            {index.provider_location?.regionName}, {index.provider_location?.countryCode}
          </div>
        )
      },
    },
    {
      title: 'No. of GPU',
      dataIndex: 'total_gpus',
      key: 'total_gpus',
    },
    {
      title: 'GPU Types',
      dataIndex: 'gpu_models',
      key: 'gpu_models',
      render: (_, index) => {
        return <div>{index.gpu_models?.join(', ').toUpperCase()}</div>
      },
    },
    {
      title: 'Uptime',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (_, index) => {
        let textClass = 'text-danger'
        if (index.uptime >= 90) {
          textClass = 'text-success'
        } else if (index.uptime < 90 && index.uptime > 50) {
          textClass = 'text-warning'
        } else {
          textClass = 'text-danger'
        }
        return (
          <div className={textClass}>
            {index.uptime?.toFixed(0)}
            {index.uptime ? '%' : '-'}
          </div>
        )
      },
    },
    {
      title: '5 minutes Interval Status',
      dataIndex: 'dotStatus',
      key: 'dotStatus',
      render: (text, index) => {
        return index.online_history?.map((online, index2) => {
          if (online) {
            return <CheckCircleOutlined key={index2} style={{ marginRight: 5, color: 'green' }} />
          }
          return <CloseCircleOutlined key={index2} style={{ marginRight: 5, color: 'red' }} />
        })
      },
    },
  ]

  const inActiveColumns = [
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (text, index) => {
        return (
          <>
            {index.praetor && (
              <div className={`${style.praetorShortLogo}`}>
                <span className="mr-1">{text}</span>
                <span>
                  <Tooltip title="Created using Praetor App">
                    <img
                      src="/resources/images/logo/red_short_40.png"
                      height="auto"
                      width={20}
                      alt="praetor logo"
                    />
                  </Tooltip>
                </span>
                <span>
                  {index.provider_note && (
                    <Tooltip className="ml-2" title={index.provider_note}>
                      <NotificationOutlined />
                    </Tooltip>
                  )}
                </span>
              </div>
            )}
            {!index.praetor && (
              <>
                <span>{text}</span>
                <span>
                  {index.provider_note && (
                    <Tooltip className="ml-2" title={index.provider_note}>
                      <NotificationOutlined />
                    </Tooltip>
                  )}
                </span>
              </>
            )}
          </>
        )
      },
    },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, index) => {
        return (
          <div className={index.status ? 'text-success' : 'text-danger'}>
            {index.status && 'Online'}
            {!index.status && 'Offline'}
          </div>
        )
      },
    },
    {
      title: 'GPU Types',
      dataIndex: 'gpu_models',
      key: 'gpu_models',
      render: (_, index) => {
        return <div>{index.gpu_models?.toString().toUpperCase()}</div>
      },
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      render: (_, index) => {
        return (
          <div>
            {index.provider_location?.regionName}, {index.provider_location?.countryCode}
          </div>
        )
      },
    },
    {
      title: '5 Minus Interval',
      dataIndex: 'dotStatus',
      key: 'dotStatus',
      render: (_, index) => {
        return index.online_history?.map((online, index2) => {
          if (online) {
            return <CheckCircleOutlined key={index2} style={{ marginRight: 5, color: 'green' }} />
          }
          return <CloseCircleOutlined key={index2} style={{ marginRight: 5, color: 'red' }} />
        })
      },
    },
  ]

  function format(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return [parseFloat((bytes / k ** i).toFixed(dm)), sizes[i]]
  }

  function handleChange(value) {
    setSearch(value)
  }

  function convertTime(value) {
    const timestamp = new Date(`${value}Z`)
    return timestamp.toUTCString()
  }

  const renderPersistentStorageType = (type) => {
    if (type === 'beta1') {
      return ' - HDD'
    }

    if (type === 'beta2') {
      return ' - SSD'
    }

    if (type === 'beta3') {
      return ' - NVME'
    }

    return ''
  }

  if (chainSelected === process.env.REACT_APP_TESTNET_CHAIN_ID) {
    activeColumns.push({
      title: 'Created On',
      dataIndex: 'created',
      key: 'created',
      render: (timestamp) => {
        // Convert the timestamp to a Date object
        const date = new Date(timestamp * 1000)
        // Render the human-readable date and time

        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }
        // Render the human-readable date and time in the desired format
        const humanReadableDate = date.toLocaleString('en-US', options)

        return <div>{humanReadableDate}</div>
      },
    })
    inActiveColumns.push({
      title: 'Created On',
      dataIndex: 'created',
      key: 'created',
      render: (timestamp) => {
        // Convert the timestamp to a Date object
        const date = new Date(timestamp * 1000)
        // Render the human-readable date and time

        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }
        // Render the human-readable date and time in the desired format
        const humanReadableDate = date.toLocaleString('en-US', options)

        return <div>{humanReadableDate}</div>
      },
    })
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const network = queryParams.get('chainid')

    if (network) {
      setChainSelected(network)
      queryParams.delete('chainid')
      fetch(`${process.env.REACT_APP_BACKEND_URL}/list-providers?chainid=${network}`)
        .then((response) => response.json())
        .then((res) => {
          setRawData(res)
        })
    } else {
      history.push({
        pathname: 'provider-status',
        search: `?chainid=akashnet-2`,
      })
      fetch(`${process.env.REACT_APP_BACKEND_URL}/list-providers?chainid=${chainSelected}`)
        .then((response) => response.json())
        .then((res) => {
          setRawData(res)
        })
    }

    const interval = setInterval(() => {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/list-providers?chainid=${chainSelected}`)
        .then((response) => response.json())
        .then((res) => {
          setRawData(res)
        })
    }, 300000)

    return () => {
      clearInterval(interval)
    }
  }, [location.search, chainSelected])

  useEffect(() => {
    if (!search || search.length === 0) {
      if (data) {
        setActiveProviders(data.providers.active_providers)
        setInActiveProviders(data.providers.inactive_providers)
      }
      return
    }

    // Search Terms
    // First Search address

    const tmpData = cloneDeep(data)
    let finalActiveData = []
    search.map((term) => {
      const res1 = tmpData.providers.active_providers.filter((row) => {
        return (
          row.url.toLowerCase().includes(term.toLowerCase()) ||
          row.cluster_public_hostname.toLowerCase().includes(term.toLowerCase()) ||
          row.address.toLowerCase().includes(term.toLowerCase()) ||
          (row.provider_location &&
            (row.provider_location?.regionName.toLowerCase().includes(term.toLowerCase()) ||
              row.provider_location?.city.toLowerCase().includes(term.toLowerCase()) ||
              row.provider_location?.countryCode.toLowerCase().includes(term.toLowerCase()) ||
              row.provider_location?.country.toLowerCase().includes(term))) ||
          row.uptime.toFixed(0).toString() === term ||
          (term.toLowerCase() === 'online' && row.status) ||
          (term.toLowerCase() === 'offline' && !row.status)
        )
      })
      tmpData.providers.active_providers = res1
      if (res1) {
        finalActiveData = res1
      }
      return null
    })
    let finalInactiveData = []

    search.map((term) => {
      const res1 = tmpData.providers.inactive_providers.filter((row) => {
        return (
          row.url.toLowerCase().includes(term.toLowerCase()) ||
          row.address.toLowerCase().includes(term.toLowerCase()) ||
          (row.provider_location &&
            (row.provider_location?.regionName.toLowerCase().includes(term.toLowerCase()) ||
              row.provider_location?.city.toLowerCase().includes(term.toLowerCase()) ||
              row.provider_location?.countryCode.toLowerCase().includes(term.toLowerCase()) ||
              row.provider_location?.country.toLowerCase().includes(term.toLowerCase()))) ||
          (term.toLowerCase() === 'online' && row.status) ||
          (term.toLowerCase() === 'offline' && !row.status)
        )
      })
      tmpData.providers.pending_resources = res1
      if (res1) {
        finalInactiveData = res1
      }
      return null
    })

    setActiveProviders(finalActiveData)
    setInActiveProviders(finalInactiveData)
  }, [search, data])

  const changeTab = (key) => {
    setActiveTab(key)
  }

  return (
    <div className={`${style.background}`}>
      {data && (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="mb-3">
                <a href="/">
                  <img
                    src="/resources/images/logo/edge_red_full.png"
                    width={200}
                    alt="Praetor Logo"
                    className="mr-2 mb-3 mr-3"
                  />
                </a>
                <a href="https://akash.network/" target="_blank" rel="noreferrer">
                  <img src={redAkashLogo} width={200} alt="Akash Logo" />
                </a>
              </div>
              <h1 className={style.h1}>Akash Provider Status</h1>
              <div className="">
                Use this status page to check an Akash Provider information and status.
                <br />
                This list is refreshed every 5 minutes. Below snapshop taken at{' '}
                <strong>{data && convertTime(data.timestamp)}</strong>
              </div>
            </div>
            <Divider />
            <div className="col-12">
              <div className="h5 pb-2">Network Selection</div>
              <div className="mt-2">
                <Select
                  value={chainSelected}
                  // size="large"
                  className={`${style.select_button}`}
                  onChange={(val) => changeChain(val)}
                  options={[
                    {
                      value: 'akashnet-2',
                      label: 'Mainnet',
                    },
                    {
                      value: process.env.REACT_APP_TESTNET_CHAIN_ID,
                      label: process.env.REACT_APP_TESTNET_NAME,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <Divider />
          <div className="row mt-5">
            <div className="col-12">
              <h4 style={{ fontWeight: '600' }}>Providers Overview</h4>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
              <Card style={{ minWidth: 200 }}>
                <div>Network Providers</div>
                <div className={`${style.cardTitle}`}>
                  <strong>{data.count.active}</strong>
                </div>
              </Card>
            </div>
            <div className="col-lg-9">
              {activeProviders && (
                <WorldMapStatus
                  green={activeTab === '1'}
                  map={activeTab === '1' ? activeProviders : inActiveProviders}
                />
              )}
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-3 col-sm-12">
              <ResourcesChart
                title="CPU"
                subtitle="Current CPU usage"
                formatBytes={false}
                formatTitle="vcpu"
                resourceData={[
                  availableNetworkUsage.cpu,
                  activeNetworkUsage.cpu,
                  pendingNetworkUsage.cpu,
                ]}
              />
            </div>
            <div className="col-md-3 col-sm-12">
              <ResourcesChart
                title="Memory"
                subtitle="Current Memory usage"
                resourceData={[
                  availableNetworkUsage.memory,
                  activeNetworkUsage.memory,
                  pendingNetworkUsage.memory,
                ]}
              />
            </div>
            <div className="col-md-3 col-sm-12">
              <ResourcesChart
                title="Ephemeral Storage"
                subtitle="Current Ephemeral Storage usage"
                resourceData={[
                  availableNetworkUsage.ephemeralStorage,
                  activeNetworkUsage.ephemeralStorage,
                  pendingNetworkUsage.ephemeralStorage,
                ]}
              />
            </div>
            <div className="col-md-3 col-sm-12">
              <ResourcesChart
                title="GPU"
                subtitle="Current GPU usage"
                formatBytes={false}
                formatTitle="GPU"
                resourceData={[
                  availableNetworkUsage.gpu,
                  activeNetworkUsage.gpu,
                  pendingNetworkUsage.gpu,
                ]}
              />
            </div>
          </div>
          <Divider />
          <div className="row mt-5">
            <div className="col-12">
              <h4 style={{ fontWeight: '600' }}>Akash Network Providers</h4>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <div className={`${style.searchInput}`}>
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Search Providers"
                  onChange={(value) => handleChange(value)}
                  size="large"
                  allowClear
                  dropdownStyle={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <Tabs defaultActiveKey={activeTab} onChange={changeTab}>
                <TabPane tab="Active" key="1">
                  <Table
                    columns={activeColumns}
                    rowKey="address"
                    expandable={{
                      expandedRowRender: (record) => {
                        return (
                          <div className="container-fluid">
                            {record.provider_note && (
                              <>
                                <div className="row mt-3">
                                  <div className="col-md-12">
                                    <h5>Provider Message</h5>
                                  </div>
                                </div>
                                <Divider style={{ marginTop: 10, marginBottom: 15 }} />
                                <div className="row mt-3">
                                  <div className="col-md-12">
                                    <div>{record.provider_note}</div>
                                  </div>
                                </div>
                              </>
                            )}
                            <div className="row mt-5">
                              <div className="col-md-12">
                                <h5>Service Url</h5>
                              </div>
                            </div>
                            <Divider style={{ marginTop: 10, marginBottom: 15 }} />
                            <div className="row mt-3">
                              <div className="col-md-12">
                                <div>{record.url}</div>
                              </div>
                            </div>
                            <div className="row mt-5">
                              <div className="col-md-12">
                                <h5>Deployments</h5>
                              </div>
                            </div>
                            <Divider style={{ marginTop: 10, marginBottom: 15 }} />
                            <div className="row">
                              <div className={`${style.attributeCard}`}>
                                <Card
                                  style={{ maxWidth: 400, paddingRight: 10, paddingLeft: 10 }}
                                  bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
                                >
                                  <div>Active Deployment</div>
                                  <div className={`${style.attributes_font}`}>
                                    <strong>{record.deployments}</strong>
                                  </div>
                                </Card>
                              </div>
                              <div className={`${style.attributeCard}`}>
                                <Card
                                  style={{ maxWidth: 400, paddingRight: 10, paddingLeft: 10 }}
                                  bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
                                >
                                  <div>Active leases</div>
                                  <div className={`${style.attributes_font}`}>
                                    <strong>{record.leases}</strong>
                                  </div>
                                </Card>
                              </div>
                              <div className={`${style.attributeCard}`}>
                                <Card
                                  style={{ maxWidth: 400, paddingRight: 10, paddingLeft: 10 }}
                                  bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
                                >
                                  <div>Active Orders</div>
                                  <div className={`${style.attributes_font}`}>
                                    <strong>{record.orders}</strong>
                                  </div>
                                </Card>
                              </div>
                            </div>

                            <div className="row mt-5">
                              <div className="col-md-12">
                                <h5>Resources</h5>
                              </div>
                            </div>
                            <Divider style={{ marginTop: 10, marginBottom: 15 }} />
                            <div className="row">
                              <div className={`${style.attributeCard} mt-3`}>
                                <Card
                                  style={{ maxWidth: 400, paddingRight: 10, paddingLeft: 10 }}
                                  bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
                                >
                                  <div>CPU</div>
                                  <div>
                                    <strong>
                                      <span className={`${style.attributes_font} text-success`}>
                                        {record.available_resources.cpu.toFixed(1)}
                                      </span>{' '}
                                      <span className="text-success">vCPU</span>
                                    </strong>{' '}
                                    Available
                                  </div>
                                  <div>
                                    <strong>
                                      <span className={`${style.attributes_font} text-info`}>
                                        {record.active_resources.cpu.toFixed(1)}
                                      </span>{' '}
                                      <span className="text-info">vCPU</span>
                                    </strong>{' '}
                                    Active
                                  </div>
                                  <div>
                                    <strong>
                                      <span className={`${style.attributes_font} text-warning`}>
                                        {record.pending_resources.cpu.toFixed(1)}
                                      </span>{' '}
                                      <span className="text-warning">vCPU</span>
                                    </strong>{' '}
                                    Pending
                                  </div>
                                </Card>
                              </div>
                              <div className={`${style.attributeCard} mt-3`}>
                                <Card
                                  style={{ maxWidth: 400, paddingRight: 10, paddingLeft: 10 }}
                                  bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
                                >
                                  <div>Memory</div>
                                  <div>
                                    <strong>
                                      <span className={`${style.attributes_font} text-success`}>
                                        {format(record.available_resources.memory)}
                                      </span>{' '}
                                    </strong>{' '}
                                    Available
                                  </div>
                                  <div>
                                    <strong>
                                      <span className={`${style.attributes_font} text-info`}>
                                        {format(record.active_resources.memory)}
                                      </span>
                                    </strong>{' '}
                                    Active
                                  </div>
                                  <div>
                                    <strong>
                                      <span className={`${style.attributes_font} text-warning`}>
                                        {format(record.pending_resources.memory)}
                                      </span>
                                    </strong>{' '}
                                    Pending
                                  </div>
                                </Card>
                              </div>
                              <div className={`${style.attributeCard} mt-3`}>
                                <Card
                                  style={{ maxWidth: 400, paddingRight: 10, paddingLeft: 10 }}
                                  bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
                                >
                                  <div>Ephemeral Storage</div>
                                  <div>
                                    <strong>
                                      <span className={`${style.attributes_font} text-success`}>
                                        {format(record.available_resources.storage_ephemeral)}
                                      </span>
                                    </strong>{' '}
                                    Available
                                  </div>
                                  <div>
                                    <strong>
                                      <span className={`${style.attributes_font} text-info`}>
                                        {format(record.active_resources.storage_ephemeral)}
                                      </span>
                                    </strong>{' '}
                                    Active
                                  </div>
                                  <div>
                                    <strong>
                                      <span className={`${style.attributes_font} text-warning`}>
                                        {format(record.pending_resources.storage_ephemeral)}
                                      </span>
                                    </strong>{' '}
                                    Pending
                                  </div>
                                </Card>
                              </div>
                              <div className={`${style.attributeCard} mt-3`}>
                                <Card
                                  style={{
                                    maxWidth: 400,
                                    paddingRight: 10,
                                    paddingLeft: 10,
                                    minHeight: 130,
                                  }}
                                  bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
                                >
                                  <div>GPU</div>
                                  {record.available_resources.gpu +
                                    record.active_resources.gpu +
                                    record.pending_resources.gpu ===
                                    0 && (
                                    <div>
                                      <strong>Not available</strong>
                                    </div>
                                  )}
                                  {record.available_resources.gpu +
                                    record.active_resources.gpu +
                                    record.pending_resources.gpu !==
                                    0 && (
                                    <>
                                      <div>
                                        <strong>
                                          <span className={`${style.attributes_font} text-success`}>
                                            {record.available_resources.gpu} GPU
                                          </span>
                                        </strong>{' '}
                                        Available
                                      </div>
                                      <div>
                                        <strong>
                                          <span className={`${style.attributes_font} text-info`}>
                                            {record.active_resources.gpu} GPU
                                          </span>
                                        </strong>{' '}
                                        Active
                                      </div>
                                      <div>
                                        <strong>
                                          <span className={`${style.attributes_font} text-warning`}>
                                            {record.pending_resources.gpu} GPU
                                          </span>
                                        </strong>{' '}
                                        Pending
                                      </div>
                                    </>
                                  )}
                                </Card>
                              </div>
                              <div className={`${style.attributeCard} mt-3`}>
                                <Card
                                  style={{
                                    maxWidth: 400,
                                    paddingRight: 10,
                                    paddingLeft: 10,
                                    minHeight: 130,
                                  }}
                                  bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
                                >
                                  <div>
                                    Persistent Storage
                                    <strong>
                                      {renderPersistentStorageType(record.storage_class)}
                                    </strong>
                                  </div>
                                  {!record.storage_class && (
                                    <div>
                                      <strong>Not available</strong>
                                    </div>
                                  )}
                                  {record.storage_class && (
                                    <>
                                      <div>
                                        <strong>
                                          <span className={`${style.attributes_font} text-success`}>
                                            {format(record.available_resources.storage)}
                                          </span>
                                        </strong>{' '}
                                        Available
                                      </div>
                                      <div>
                                        <strong>
                                          <span className={`${style.attributes_font} text-info`}>
                                            {format(record.active_resources.storage)}
                                          </span>
                                        </strong>{' '}
                                        Active
                                      </div>
                                      <div>
                                        <strong>
                                          <span className={`${style.attributes_font} text-warning`}>
                                            {format(record.pending_resources.storage)}
                                          </span>
                                        </strong>{' '}
                                        Pending
                                      </div>
                                    </>
                                  )}
                                </Card>
                              </div>
                            </div>
                            <div className="row mt-5">
                              <div className="col-md-12">
                                <h5>Attributes</h5>
                              </div>
                            </div>
                            <Divider style={{ marginTop: 10, marginBottom: 15 }} />
                            <div className="row">
                              {record.attributes.map((attribute) => {
                                return (
                                  <div className={`${style.attributeCard}`} key={attribute.key}>
                                    <Card
                                      style={{ maxWidth: 400, paddingRight: 10, paddingLeft: 10 }}
                                      bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
                                    >
                                      <div>{attribute.key}</div>
                                      <div className={`${style.attributes_font}`}>
                                        <strong>{attribute.value}</strong>
                                      </div>
                                    </Card>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      },
                    }}
                    dataSource={activeProviders}
                  />
                </TabPane>
                <TabPane tab="Inactive" key="2">
                  <Table
                    columns={inActiveColumns}
                    rowKey="address"
                    dataSource={inActiveProviders}
                  />
                </TabPane>
              </Tabs>
            </div>
          </div>
          <Divider />

          <div className="row">
            <div className="col-md-12 mb-3">
              <div className="mr-3">
                Powered By <img src={redAkashLogo} height={20} alt="akash logo" />
              </div>
            </div>
            <div className="col-md-12">
              Use <a href="/">Praetor App</a> to become an Akash provider. <br />
              Uptime uses seven-day average runtime of provider service. <br />
              Total CPU, Memory and Storage calculated by using active providers on the Network.
              <br /> Please support is by delegating AKT -{' '}
              <a
                rel="noreferrer"
                href="https://www.mintscan.io/akash/validators/akashvaloper1zn3efzs3dlxc8vz6yq2axrv68c8wqacxcuxt5t"
                target="_blank"
              >
                Delegate Us
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = ({ dispatch }) => ({
  dispatch,
})

export default connect(mapStateToProps)(ProviderStatus)
