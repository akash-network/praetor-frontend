import { Table, Tabs, Divider, Tooltip } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { history } from 'index'
import { getProviderDeployments, getLatestBlock } from 'services/deployments'
import { uaktToAkt, formatBytes } from 'utils/common'
import { totalDeploymentCost, totalAmountSpent } from 'utils/calulations'

const { TabPane } = Tabs

const activeColumns = [
  {
    title: 'Deployer',
    dataIndex: 'owner',
    key: 'owner',
    render: (text) => {
      return text
    },
  },
  {
    title: () => (
      <Tooltip placement="topLeft" title="Deployment Sequence">
        DSEQ
      </Tooltip>
    ),
    dataIndex: 'dseq',
    key: 'dseq',
  },
  {
    title: 'Amount Spent',
    dataIndex: 'amountSpent',
    key: 'amountSpent',
    render: (text) => {
      return `${uaktToAkt(text)} AKT`
    },
  },
  {
    title: () => (
      <Tooltip placement="topLeft" title="Total Deployment cost per month">
        Cost
      </Tooltip>
    ),
    dataIndex: 'costPerMonth',
    key: 'costPerMonth',
    render: (_, record) => {
      return record.costPerMonth ? `${uaktToAkt(record?.costPerMonth)} AKT` : 'N/A'
    },
  },
  {
    title: 'GPU',
    dataIndex: 'gpu',
    key: 'gpu',
    render: (_, record) => {
      return record?.resources.gpu === 0 ? '-' : `${record?.resources.gpu}`
    },
  },
  {
    title: 'CPU',
    dataIndex: 'cpu',
    key: 'cpu',
    render: (_, record) => {
      return `${record?.resources.cpu / 1000} vcpu`
    },
  },
  {
    title: 'Memory',
    dataIndex: 'memory',
    key: 'memory',
    render: (_, record) => {
      return formatBytes(record?.resources.memory)
    },
  },
  {
    title: () => (
      <Tooltip placement="topLeft" title="Ephemeral Storage">
        Eph. Storage
      </Tooltip>
    ),
    dataIndex: 'ephemeralStorage',
    key: 'ephemeralStorage',
    render: (_, record) => {
      return formatBytes(record?.resources.ephemeralStorage)
    },
  },
  {
    title: () => (
      <Tooltip
        placement="topLeft"
        title="Akash persistent storage allows deployment data to persist through the lifetime of a lease."
      >
        Per. Storage
      </Tooltip>
    ),
    dataIndex: 'persistentStorage',
    key: 'persistentStorage',
    render: (_, record) => {
      return record?.resources.persistentStorage === 0
        ? '-'
        : formatBytes(record?.resources.persistentStorage)
    },
  },
]

const inActiveColumns = [
  {
    title: 'Deployer',
    dataIndex: 'owner',
    key: 'owner',
  },
  {
    title: () => (
      <Tooltip placement="topLeft" title="Deployment Sequence">
        DSEQ
      </Tooltip>
    ),
    dataIndex: 'dseq',
    key: 'dseq',
  },

  {
    title: 'Amount Spent',
    dataIndex: 'amountSpent',
    key: 'amountSpent',
    render: (text) => {
      return `${uaktToAkt(text)} AKT`
    },
  },
  {
    title: () => (
      <Tooltip placement="topLeft" title="Total Deployment cost per month">
        Cost
      </Tooltip>
    ),
    dataIndex: 'costPerMonth',
    key: 'costPerMonth',
    render: (_, record) => {
      return record.costPerMonth ? `${uaktToAkt(record?.costPerMonth)} AKT` : 'N/A'
    },
  },
]

const ProviderDeployments = () => {
  const [activeDeployments, setActiveDeployments] = useState(null)
  const [inActiveDeployments, setInActiveDeployments] = useState(null)
  const [loading, setLoading] = useState(false)
  const [latestBlock, setLatestBlock] = useState('')
  const [pageSize, setPageSize] = React.useState(10)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [currentTab, setTab] = React.useState('1')

  const getDeployments = useCallback(
    async (offset, limit, status) => {
      try {
        if (latestBlock?.length) {
          setLoading(true)
          const { response } = await getProviderDeployments(offset, limit, status)
          if (status === 'active') {
            const activeDepData = response.data.deployments.map((item, index) => {
              let totalCost = 0.0
              let totalAmtSpent = 0.0
              totalCost += totalDeploymentCost(item.leases)
              totalAmtSpent += totalAmountSpent(item.leases, latestBlock)
              return {
                ...item,
                amountSpent: totalAmtSpent,
                costPerMonth: totalCost,
                latestBlock,
                key: index + 1,
              }
            })
            activeDepData.total = response?.data?.total
            setActiveDeployments(activeDepData)
          } else if (status === 'closed') {
            const closedDepData = response.data.deployments.map((item, index) => {
              let totalCost = 0.0
              let totalAmtSpent = 0.0
              totalCost += totalDeploymentCost(item.leases)
              totalAmtSpent += totalAmountSpent(item.leases, latestBlock)

              return {
                ...item,
                costPerMonth: totalCost,
                amountSpent: totalAmtSpent,
                key: index + 1,
              }
            })
            closedDepData.total = response?.data?.total
            setInActiveDeployments(closedDepData)
          }
        }
        setLoading(false)
      } catch (error) {
        console.log('error fetching deployments ', error)
      }
    },
    [latestBlock],
  )

  useEffect(() => {
    getDeployments(0, 10, 'active')
  }, [getDeployments])

  useEffect(() => {
    const fetchLatestBlock = async () => {
      try {
        setLoading(true)
        const { response } = await getLatestBlock()
        if (response.status === 'success') {
          setLatestBlock(response.data)
        }
      } catch (error) {
        console.log('Error in fetching latest block', error)
      }
    }
    fetchLatestBlock()
  }, [])

  const handlePageChange = (page) => {
    if (currentTab === '1') {
      if (pageSize === page.pageSize) {
        getDeployments((page.current - 1) * pageSize, pageSize, 'active')
        setCurrentPage(page.current)
      } else {
        getDeployments(0, page.pageSize, 'active')
        setCurrentPage(1)
      }
      setPageSize(page.pageSize)
    } else if (currentTab === '2') {
      if (pageSize === page.pageSize) {
        getDeployments((page.current - 1) * pageSize, pageSize, 'closed')
        setCurrentPage(page.current)
      } else {
        getDeployments(0, page.pageSize, 'closed')
        setCurrentPage(1)
      }
      setPageSize(page.pageSize)
    }
  }

  const handleTabChange = (tab) => {
    if (tab === '2') {
      getDeployments(0, 10, 'closed')
      setTab(tab)
      setCurrentPage(1)
      setPageSize(10)
    } else if (tab === '1') {
      getDeployments(0, 10, 'active')
      setTab(tab)
      setCurrentPage(1)
      setPageSize(10)
    }
  }

  return (
    <>
      <div className="container-full">
        {!loading && (
          <>
            <div className="row mt-5">
              <div className="col-12">
                <h3 className="mb-3">
                  <strong>Provider Deployments</strong>
                </h3>
              </div>
            </div>
            <Divider />
          </>
        )}

        <div className="row mt-5">
          <div className="col-12">
            <Tabs defaultActiveKey={currentTab} onChange={(tab) => handleTabChange(tab)}>
              <TabPane tab="Active" key="1">
                <div className="row mt-3">
                  <div className="col-12">
                    <Table
                      scroll={{ x: 'max-content' }}
                      loading={loading}
                      columns={activeColumns}
                      dataSource={activeDeployments}
                      onChange={(event) => handlePageChange(event)}
                      onRow={(item, index) => ({
                        onClick: () =>
                          history.push({
                            pathname: `/provider-deployments/${activeDeployments[index].owner}/${item.dseq}`,
                          }),
                      })}
                      pagination={{
                        pageSizeOptions: ['10', '20', '50'],
                        showSizeChanger: true,
                        total: activeDeployments?.total,
                        current: currentPage,
                        defaultCurrent: 1,
                        pageSize,
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Inactive" key="2">
                <div className="row mt-3">
                  <div className="col-12">
                    <Table
                      scroll
                      loading={loading}
                      columns={inActiveColumns}
                      dataSource={inActiveDeployments}
                      onRow={(item, index) => ({
                        onClick: () =>
                          history.push({
                            pathname: `/provider-deployments/${inActiveDeployments[index].owner}/${item.dseq}`,
                          }),
                      })}
                      onChange={(event) => handlePageChange(event)}
                      pagination={{
                        pageSizeOptions: ['10', '20', '50'],
                        showSizeChanger: true,
                        total: inActiveDeployments?.total,
                        current: currentPage,
                        defaultCurrent: 1,
                        pageSize,
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProviderDeployments
