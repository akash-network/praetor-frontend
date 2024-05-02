import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Divider, Skeleton, Tooltip } from 'antd'
import UpdateAttributes from 'components/UpdateAttributes'
import style from './style.module.scss'

const ProviderAttributes = ({ resources, showDrawer, setDrawer, onSessionOpen }) => {
  // const [showModal, setShowModal] = React.useState(false)
  const updateAttributes = () => {
    onSessionOpen()
  }
  return (
    <>
      <div className={`${style.container}`}>
        {resources.loading && (
          <div className="continer-fluid">
            <div className="row mt-5 mb-3">
              <div className="col-12">
                <div className="row">
                  <div className="col-8">
                    <h4 className="mb-3">
                      <Skeleton.Input active />
                    </h4>
                  </div>
                  <div className="col-3">
                    <Skeleton.Input active />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-auto mt-3">
                    <Card style={{ minWidth: 200 }}>
                      <div>
                        <Skeleton.Input active />
                      </div>
                      <div className={`${style.attributes_font}`}>
                        <strong>
                          <Skeleton.Input active />
                        </strong>
                      </div>
                    </Card>
                  </div>
                  <div className="col-md-auto mt-3">
                    <Card style={{ minWidth: 200 }}>
                      <div>
                        <Skeleton.Input active />
                      </div>
                      <div className={`${style.attributes_font}`}>
                        <strong>
                          <Skeleton.Input active />
                        </strong>
                      </div>
                    </Card>
                  </div>
                  <div className="col-md-auto mt-3">
                    <Card style={{ minWidth: 200 }}>
                      <div>
                        <Skeleton.Input active />
                      </div>
                      <div className={`${style.attributes_font}`}>
                        <strong>
                          <Skeleton.Input active />
                        </strong>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!resources.loading && resources.providerDetails && (
          <div className="continer-fluid mb-5">
            <div className="row mt-5">
              <div className="col-12">
                <div className="row">
                  <div className="col-11">
                    <h3 className="mb-3">
                      <strong>Attributes</strong>
                    </h3>
                  </div>
                </div>
                <Divider />
                <div className="row">
                  {resources.providerDetails?.provider_attributes.attributes.map((props, index) => {
                    return (
                      <div className="col-md-auto mt-3" key={index}>
                        <Card style={{ minWidth: 200 }} title={props.key}>
                          <div className={`${style.attributes_font}`}>
                            <strong>{props.value}</strong>
                          </div>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
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
                    onClick={() => updateAttributes()}
                    disabled={!resources?.providerDetails.session_id}
                  >
                    Edit Attributes
                  </Button>
                </Tooltip>
              </div>
            </div>
            <UpdateAttributes showDrawer={showDrawer} onCloseDrawer={() => setDrawer(false)} />
            <Divider />
          </div>
        )}
      </div>
    </>
  )
}

const mapStateToProps = ({ resources, dispatch }) => ({
  dispatch,
  resources,
})

export default connect(mapStateToProps)(ProviderAttributes)
