import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Skeleton, Divider, Button, Card, Badge, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import _ from 'lodash'
import Swal from 'sweetalert2'
import style from './style.module.scss'

const ProviderVersion = ({ resources, onSessionOpen, dispatch, drawerName }) => {
  const [disableUpgradeBtn, setDisableUpgradeBtn] = useState(false)
  const [disableRestartBtn, setDisableRestartBtn] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [restartLoading, setRestartLoading] = useState(false)
  const [btnClickName, setBtnClickName] = useState('')
  useEffect(() => {
    if (!resources?.processLoading) {
      setDisableUpgradeBtn(false)
      setDisableRestartBtn(false)
      setUpgradeLoading(false)
      setRestartLoading(false)
    }
  }, [resources?.processLoading])

  useEffect(() => {
    if (resources?.sessionUpdated && drawerName === 'version' && btnClickName === 'restart') {
      setDisableUpgradeBtn(true)
      setUpgradeLoading(false)
      setRestartLoading(true)
      Swal.fire({
        title: 'Restart Provider',
        text: `Your provider will be restarted.`,
        icon: 'info',
        confirmButtonColor: '#ff7043',
        denyButtonColor: '#c2c2c2',
        confirmButtonText: 'Yes',
        showDenyButton: true,
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch({
            type: 'resources/RESTART_PROVIDER',
          })
        } else {
          setRestartLoading(false)
          setDisableUpgradeBtn(false)
          dispatch({
            type: 'resources/GET_PROVIDER_VERSION',
          })
        }
      })
    }
    if (
      resources?.sessionUpdated &&
      drawerName === 'version' &&
      btnClickName === 'checkForUpgrade'
    ) {
      dispatch({
        type: 'resources/GET_PROVIDER_VERSION',
      })
    }
  }, [resources?.sessionUpdated, dispatch, drawerName, btnClickName])

  const connectControlMachine = () => {
    setBtnClickName('checkForUpgrade')
    onSessionOpen()
  }

  const upgradeVersion = () => {
    setDisableRestartBtn(true)
    setRestartLoading(false)
    setUpgradeLoading(true)
    if (
      resources?.versions.versionUpgradable &&
      !_.isEqual(resources?.versions.providerVersion, resources?.versions.systemVersion)
    ) {
      Swal.fire({
        title: 'Upgrade provider version',
        text: `Your Provider version will be updated from ${resources?.versions.providerVersion} to ${resources?.versions.systemVersion}`,
        icon: 'info',
        confirmButtonColor: '#ff7043',
        denyButtonColor: '#c2c2c2',
        confirmButtonText: 'Yes',
        showDenyButton: true,
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch({
            type: 'resources/UPGRADE_PROVIDER_VERSION',
          })
        } else {
          dispatch({
            type: 'resources/SET_STATE',
            payload: {
              processLoading: false,
            },
          })
          setDisableRestartBtn(false)
        }
      })
    }
  }
  const restartProvider = () => {
    setBtnClickName('restart')
    if (resources?.sessionExist) {
      setDisableUpgradeBtn(true)
      setUpgradeLoading(false)
      setRestartLoading(true)
      Swal.fire({
        title: 'Restart Provider',
        text: `Your provider will be restarted.`,
        icon: 'info',
        confirmButtonColor: '#ff7043',
        denyButtonColor: '#c2c2c2',
        confirmButtonText: 'Yes',
        showDenyButton: true,
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch({
            type: 'resources/RESTART_PROVIDER',
          })
        } else {
          setRestartLoading(false)
          setDisableUpgradeBtn(false)
        }
      })
    } else {
      onSessionOpen()
    }
  }

  return (
    <>
      <div className={`${style.container}`}>
        {resources.loading && (
          <>
            <div className="row mt-5">
              <div className="col-12">
                <h3 className="mb-3">
                  <Skeleton.Input active />
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-md-auto mt-3">
                <Card style={{ minWidth: 220 }}>
                  <div>
                    <Skeleton.Input active />
                  </div>
                </Card>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <div>
                  <Skeleton.Input active />
                </div>
              </div>
            </div>
          </>
        )}

        {!resources.loading && resources?.providerDetails?.session_id && (
          <>
            <div className="row mt-5">
              <div className="col-12">
                <h3 className="mb-3">
                  <strong>Provider Version</strong>
                </h3>
              </div>
            </div>
            <Divider />
            {resources?.sessionExist && resources?.versions ? (
              <>
                <div className="row">
                  <div className="col-md-auto mt-3">
                    {_.isEqual(
                      resources?.versions.providerVersion,
                      resources?.versions.systemVersion,
                    ) ? (
                      <Badge.Ribbon text="latest" color="green">
                        <Card style={{ minWidth: 220 }} title="Provider Version">
                          <div className={`${style.attributes_font}`}>
                            <strong>{resources?.versions.providerVersion}</strong>
                          </div>
                        </Card>
                      </Badge.Ribbon>
                    ) : (
                      <div>
                        {!resources?.versions?.versionUpgradable ? (
                          <>
                            {resources?.versions?.providerVersion && (
                              <Badge.Ribbon text="version-mismatch" color="red">
                                <Card style={{ minWidth: 270 }} title="Provider Version">
                                  <div className={`${style.attributes_font}`}>
                                    <strong>{resources?.versions.providerVersion}</strong>
                                  </div>
                                </Card>
                              </Badge.Ribbon>
                            )}
                          </>
                        ) : (
                          <Badge.Ribbon text="outdated" color="red">
                            <Card style={{ minWidth: 220 }} title="Provider Version">
                              <div className={`${style.attributes_font}`}>
                                <strong>{resources?.versions.providerVersion}</strong>
                              </div>
                            </Card>
                          </Badge.Ribbon>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {!resources?.versions?.versionUpgradable ? (
                  <div className="row mt-3">
                    <div className="col-12">
                      NOTE: You cannot upgrade your Provider. Please{' '}
                      <a
                        href="https://discord.gg/uzUCHTF93D"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        contact{' '}
                      </a>{' '}
                      Praetor support for version upgrade. <br />
                    </div>
                  </div>
                ) : (
                  <>
                    {!_.isEqual(
                      resources?.versions.providerVersion,
                      resources?.versions.systemVersion,
                    ) && (
                      <div className="row mt-3">
                        <div className="col-12">
                          <div>Your Provider version is outdated. Please update your provider.</div>
                          <div className="text-danger mt-3">
                            Note: If you have started upgrade process, <br />
                            Please wait for 15 minutes for the process to finish. Do not start the
                            upgrade again.
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="row mt-5">
                      <div className="col-6">
                        <Button
                          type="primary"
                          onClick={() => upgradeVersion()}
                          disabled={
                            _.isEqual(
                              resources?.versions.providerVersion,
                              resources?.versions.systemVersion,
                            ) ||
                            !resources?.versions.versionUpgradable ||
                            disableUpgradeBtn
                          }
                          loading={resources.processLoading && upgradeLoading}
                        >
                          Upgrade Provider
                        </Button>

                        <Button
                          className="ml-3"
                          type="primary"
                          onClick={() => restartProvider()}
                          loading={resources?.processLoading && restartLoading}
                          disabled={disableRestartBtn}
                        >
                          Restart Provider
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="row mt-5">
                  <div className="col-6">
                    <Button type="primary" onClick={() => connectControlMachine()}>
                      Check for upgrades
                    </Button>
                    <Button
                      className="ml-3"
                      type="primary"
                      onClick={() => restartProvider()}
                      loading={resources?.processLoading && restartLoading}
                      disabled={disableRestartBtn}
                    >
                      Restart Provider
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {!resources.loading && !resources?.providerDetails?.session_id && (
          <>
            <div className="row mt-5">
              <div className="col-12">
                <h3 className="mb-3">
                  <strong>Provider Version</strong>
                </h3>
              </div>
            </div>
            <Divider />
            <div className="row">
              <div className="col-12">
                Note: Praetor Provider version not available.
                <Tooltip title="Praetor version is not available since Akash version 0.18.0">
                  <span>
                    <InfoCircleOutlined />
                  </span>
                </Tooltip>
              </div>
            </div>
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

export default connect(mapStateToProps)(ProviderVersion)
