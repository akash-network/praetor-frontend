import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Tag, Divider, Card, Tooltip } from 'antd'
import { avgBlockPerMonth, convertUtcToLocal, formatBytes, uaktToAkt } from 'utils/common'
import {
  convertInput,
  timeCalculation,
  totalAmountSpent,
  totalDeploymentCost,
} from 'utils/calulations'
import { getDeploymentDetails } from 'services/deployments'
import Empty from 'components/Empty'

import style from './style.module.scss'

const DeploymentDetails = () => {
  const { pathname } = useLocation()
  const dseq = pathname?.split('/')[3]
  const owner = pathname?.split('/')[2]
  const [deployment, setDeployment] = useState(null)
  const [loading, setLoading] = useState(false)

  const deploymentDetails = useCallback(async () => {
    try {
      setLoading(true)
      const { response } = await getDeploymentDetails(owner, dseq)
      if (response.status === 'success') {
        const depDetails = response.data.deployments
        depDetails.costPerMonth = totalDeploymentCost(depDetails.leases)
        depDetails.amountSpent = totalAmountSpent(depDetails.leases, response.data.latest_block)
        depDetails.latestBlock = response.data.latest_block
        setDeployment(depDetails)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }, [dseq, owner])
  useEffect(() => {
    deploymentDetails()
  }, [deploymentDetails])
  return (
    <>
      {loading && (
        <>
          <div className={`${style.flex_container}`}>
            <div className="row">
              <Empty />
            </div>
          </div>
        </>
      )}
      {!loading && (
        <div className="container-full">
          <div className="row mt-2">
            <div className="col-12">
              <Link to="/provider-deployments">
                <ArrowLeftOutlined /> Deployments
              </Link>
            </div>
            <div className="col-12 mt-4 ml-2 mb-1">
              <div className="float-right pr-3">
                {deployment?.status === 'active' ? (
                  <Tag className={`${style.tag}`} color="#007200">
                    {deployment?.status}
                  </Tag>
                ) : (
                  <Tag className={`${style.tag}`} color="#FF0000">
                    {deployment?.status}
                  </Tag>
                )}
              </div>
              <div>
                <strong style={{ fontSize: '12px !important' }}>Lease Owner</strong>
                <br />
                <h4>
                  <span>{deployment?.owner}</span>
                </h4>
              </div>
            </div>
            <div className="col-12 ml-2 mt-1">
              <div>
                <strong>DSEQ</strong>
                <br />
                <h4>
                  <span>{deployment?.dseq}</span>
                </h4>
              </div>
            </div>
          </div>
          <Divider />
          <div className="row mt-2">
            {deployment?.leases.length === 1 && (
              <div className="col-auto mt-3">
                <Tooltip
                  placement="topLeft"
                  title={
                    deployment.status === 'active'
                      ? 'Remaining time for completion of deployment'
                      : 'Total time spent of deployment'
                  }
                >
                  <Card style={{ minWidth: 150 }}>
                    {deployment.status === 'active' ? <div>Time Left</div> : <div>Time Spent</div>}
                    <div className={`${style.card_title}`}>
                      <strong>
                        {' '}
                        {
                          convertInput(
                            timeCalculation(
                              deployment?.leases,
                              deployment?.latestBlock,
                              deployment?.total_balance,
                            ),
                          ).split(',')[0]
                        }
                      </strong>
                    </div>
                    <div>
                      {convertInput(
                        timeCalculation(
                          deployment?.leases,
                          deployment?.latestBlock,
                          deployment?.total_balance,
                        ),
                      ).split(',')[1] ? (
                        <>
                          {
                            convertInput(
                              timeCalculation(
                                deployment?.leases,
                                deployment?.latestBlock,
                                deployment?.total_balance,
                              ),
                            ).split(',')[1]
                          }
                        </>
                      ) : (
                        <code className={`${style.code}`}>&#8205</code>
                      )}
                    </div>
                  </Card>
                </Tooltip>
              </div>
            )}
            <div className="col-auto mt-3">
              <Tooltip placement="topLeft" title="Total Deployment cost per month">
                <Card style={{ minWidth: 150 }}>
                  <div>Cost</div>
                  <div className={`${style.card_title}`}>
                    <strong>{uaktToAkt(deployment?.costPerMonth)} AKT</strong>
                  </div>
                  <div>/month</div>
                </Card>
              </Tooltip>
            </div>
            <div className="col-auto mt-3">
              <Card style={{ minWidth: 150 }}>
                <div>Amount Spent</div>
                <div className={`${style.card_title}`}>
                  <strong>{uaktToAkt(deployment?.amountSpent)}</strong>
                </div>
                <div>AKT</div>
              </Card>
            </div>
            <div className="col-auto mt-3">
              <Tooltip placement="topLeft" title="Remaining Escrow balance of deployment">
                <Card style={{ minWidth: 150 }}>
                  <div>Balance</div>
                  <div className={`${style.card_title}`}>
                    <strong>{uaktToAkt(deployment?.balance)}</strong>
                  </div>
                  <div>AKT</div>
                </Card>
              </Tooltip>
            </div>
            <div className="col-auto mt-3">
              <Tooltip placement="topLeft" title="Total transferred amount of deployment">
                <Card style={{ minWidth: 150 }}>
                  <div>Transfered</div>
                  <div className={`${style.card_title}`}>
                    <strong>{uaktToAkt(deployment?.transferred)}</strong>
                  </div>
                  <div>AKT</div>
                </Card>
              </Tooltip>
            </div>
          </div>
          <Divider />
          <div className="row mt-2">
            <div className="col-12">
              <h3 className="mb-3">
                {deployment?.leases.length > 1 ? <strong>Leases</strong> : <strong>Lease</strong>}
              </h3>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              {deployment?.leases.map((item) => (
                <div key={Number(deployment.dseq)}>
                  <Card bordered={false} style={{ width: 'auto' }}>
                    <div className={`row ${style.tag_div}`}>
                      <h5>
                        <div>
                          {deployment?.status === 'active' ? (
                            <Tag className={`${style.tag}`} color="#007200">
                              {deployment?.status}
                            </Tag>
                          ) : (
                            <Tag className={`${style.tag}`} color="#FF0000">
                              {deployment?.status}
                            </Tag>
                          )}
                        </div>
                      </h5>
                    </div>
                    <div className={`row ${style.gseq_oseq_row}`}>
                      <div className="col-12 col-md-1">
                        <Tooltip
                          placement="topLeft"
                          title="Akash GSEQ is used to distinguish “groups” of containers in a deployment."
                        >
                          <strong>GSEQ</strong>
                        </Tooltip>
                        <br />
                        <h4>
                          <span>{item?.gseq}</span>
                        </h4>
                      </div>
                      <div className="col-12 col-md-1">
                        <div>
                          <Tooltip
                            placement="topLeft"
                            title="Akash OSEQ is used to distinguish multiple orders associated with a single deployment."
                          >
                            <strong>OSEQ</strong>
                          </Tooltip>
                          <h4>
                            <span>{item?.oseq}</span>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 mt-4">
                        <div className="row">
                          <div className="col-auto pt-2">
                            <Tooltip placement="topLeft" title="Lease cost per month">
                              <Card style={{ minWidth: 100 }}>
                                <div>Cost</div>
                                <div className={`${style.card_title}`}>
                                  <strong>{uaktToAkt(item?.price * avgBlockPerMonth)} AKT</strong>
                                </div>
                                <div>/month</div>
                              </Card>
                            </Tooltip>
                          </div>
                          <div className="col-auto pt-2">
                            {item?.createdDate && (
                              <Card style={{ minWidth: 100 }}>
                                <div>Created At</div>
                                {convertUtcToLocal(item?.createdDate).split(',').length > 1 ? (
                                  <>
                                    <div className={`${style.card_title}`}>
                                      <strong>
                                        {convertUtcToLocal(item?.createdDate).split(',')[0]}
                                      </strong>
                                    </div>
                                    <div>{convertUtcToLocal(item?.createdDate).split(',')[1]}</div>
                                  </>
                                ) : (
                                  <div className={`${style.card_title}`}>
                                    <strong>{convertUtcToLocal(item?.createdDate)}</strong>
                                  </div>
                                )}
                              </Card>
                            )}
                          </div>
                          {item?.status === 'closed' && item?.closedDate && (
                            <div className="col-auto pt-2">
                              <Card style={{ minWidth: 100 }}>
                                <div>Closed At</div>
                                <div className={`${style.card_title}`}>
                                  <strong>
                                    {convertUtcToLocal(item?.closedDate).split(',')[0]}
                                  </strong>
                                </div>
                                <div>{convertUtcToLocal(item?.closedDate).split(',')[1]}</div>
                              </Card>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 mt-4">
                        <div className="row">
                          {item?.resources?.gpu !== 0 && (
                            <div className="col-auto mt-1">
                              <Card size="small" style={{ minWidth: 100 }}>
                                <div>GPU</div>
                                <div className={`${style.card_title}`}>
                                  <strong>{item?.resources?.gpu}</strong>
                                </div>
                              </Card>
                            </div>
                          )}

                          <div className="col-auto mt-1">
                            <Card size="small" style={{ minWidth: 100 }}>
                              <div>CPU</div>
                              <div className={`${style.card_title}`}>
                                <strong>{item?.resources?.cpu / 1000} vcpu</strong>
                              </div>
                            </Card>
                          </div>
                          <div className="col-auto mt-1">
                            <Card size="small" style={{ minWidth: 100 }}>
                              <div>Memory</div>
                              <div className={`${style.card_title}`}>
                                <strong>{formatBytes(item?.resources?.memory)}</strong>
                              </div>
                            </Card>
                          </div>
                          <div className="col-auto mt-1">
                            <Card size="small" style={{ minWidth: 100 }}>
                              <div>Eph. Storage</div>
                              <div className={`${style.card_title}`}>
                                <strong>{formatBytes(item?.resources?.ephemeralStorage)}</strong>
                              </div>
                            </Card>
                          </div>
                          {item?.resources?.persistentStorage !== 0 && (
                            <div className="col-auto mt-1">
                              <Card size="small" style={{ minWidth: 100 }}>
                                <Tooltip
                                  placement="topLeft"
                                  title="Akash persistent storage allows deployment data to persist through the lifetime of a lease."
                                >
                                  <div>Per. Storage</div>
                                </Tooltip>
                                <div className={`${style.card_title}`}>
                                  <strong>{formatBytes(item?.resources?.persistentStorage)}</strong>
                                </div>
                              </Card>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {deployment?.leases.length > 1 && <Divider />}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeploymentDetails
