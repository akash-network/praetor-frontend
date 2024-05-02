import React from 'react'
import { connect } from 'react-redux'
import { history } from 'index'
import moment from 'moment'
import UpdateProviderNote from 'components/UpdateProviderNote'
import { Button, Card, Divider, Skeleton } from 'antd'
import style from './style.module.scss'

const ProviderNote = ({ resources }) => {
  const [showModal, setShowModal] = React.useState(false)

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
                  <strong>Message to Deployers</strong>
                </h3>
              </div>
            </div>
            <Divider />
            {!resources.providerNote && !resources.providerNote?.message && (
              <div className="row">
                <div className="col-11 col-sm-11">
                  Provide Important Information to your provider leases holder like downtime,
                  upgrades etc. <br />
                  you can see your updated notes{' '}
                  <Button
                    style={{ padding: 0, paddingLeft: 3 }}
                    type="link"
                    onClick={() => history.push('/provider-status')}
                  >
                    here
                  </Button>
                </div>
              </div>
            )}
            {resources.providerNote?.message && (
              <div className="row">
                <div className="col-11 col-sm-11 col-md-4 col-lg-4 mt-3">
                  <Card style={{ minWidth: 200 }} title="Provider Message Details">
                    <div>{resources.providerNote?.message}</div>
                    <div className="row mt-2">
                      <Divider />
                      <div className="col-12 mb-2">Timeframe</div>
                      <div className="col-12">
                        <strong>
                          {moment
                            .unix(resources.providerNote?.startTime)
                            .format('YYYY-MM-DD HH:mm:ss')}
                          {'  ---  '}
                          {moment
                            .unix(resources.providerNote?.endTime)
                            .format('YYYY-MM-DD HH:mm:ss')}
                        </strong>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            <div className="row mt-4">
              <div className="col-12">
                <Button type="primary" onClick={() => setShowModal(true)}>
                  {resources.providerNote?.message && 'Edit'}
                  {!resources.providerNote?.message && 'Add'}&nbsp;Provider Message
                </Button>
              </div>
            </div>
            <UpdateProviderNote
              showDrawer={showModal}
              onCloseDrawer={() => {
                setShowModal(false)
              }}
            />
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

export default connect(mapStateToProps)(ProviderNote)
