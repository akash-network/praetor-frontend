import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Divider, Skeleton } from 'antd'
import UpdatePricing from 'components/UpdatePricing'
import style from './style.module.scss'

const ProviderPricing = ({ showDrawer, setDrawer, onSessionOpen, resources }) => {
  const updatePrice = () => {
    onSessionOpen()
  }

  return (
    <>
      {resources.providerDetails?.session_id && (
        <div className={`${style.container}`}>
          {resources.priceLoading && (
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
          {!resources.loading && !resources.priceLoading && resources.currentPrices && (
            <>
              <div className="row mt-5">
                <div className="col-12">
                  <h3 className="mb-3">
                    <strong>Pricing</strong>
                  </h3>
                </div>
              </div>
              <Divider />
              <div className="row">
                <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                  <Card style={{ minWidth: 200 }} title="CPU Scale Bid Price">
                    <div>
                      <div className={`${style.attributes_font}`}>
                        <strong>{resources.currentPrices.bid_price_cpu_scale} </strong>
                        USD/thread-month
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                  <Card style={{ minWidth: 200 }} title="Memory Scale Bid Price">
                    <div>
                      <div className={`${style.attributes_font}`}>
                        <strong>{resources.currentPrices.bid_price_memory_scale} </strong>
                        USD/GB-month
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                  <Card style={{ minWidth: 200 }} title="Storage Scale Bid Price">
                    <div>
                      <div className={`${style.attributes_font}`}>
                        <strong>{resources.currentPrices.bid_price_storage_scale} </strong>
                        USD/GB-month
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                  <Card style={{ minWidth: 200 }} title="Persistent Storage(HDD) Scale Bid Price">
                    <div>
                      <div className={`${style.attributes_font}`}>
                        <strong>{resources.currentPrices.bid_price_hd_pres_hdd_scale} </strong>
                        USD/GB-month
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                  <Card style={{ minWidth: 200 }} title="Persistent Storage(SSD) Scale Bid Price">
                    <div>
                      <div className={`${style.attributes_font}`}>
                        <strong>{resources.currentPrices.bid_price_hd_pres_ssd_scale} </strong>
                        USD/GB-month
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                  <Card style={{ minWidth: 200 }} title="Persistent Storage(NVME) Scale Bid Price">
                    <div>
                      <div className={`${style.attributes_font}`}>
                        <strong>{resources.currentPrices.bid_price_hd_pres_nvme_scale} </strong>
                        USD/GB-month
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                  <Card style={{ minWidth: 200 }} title="Endpoint Scale Bid Price">
                    <div>
                      <div className={`${style.attributes_font}`}>
                        <strong>{resources.currentPrices.bid_price_endpoint_scale} </strong>
                        Port/month
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                  <Card style={{ minWidth: 200 }} title="IP Scale Bid Price">
                    <div>
                      <div className={`${style.attributes_font}`}>
                        <strong>{resources.currentPrices.bid_price_ip_scale} </strong>
                        IP/month
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-11 col-sm-11 col-md-3 col-lg-3 mt-3">
                  <Card style={{ minWidth: 200 }} title="GPU Scale Bid Price">
                    <div>
                      <div className={`${style.attributes_font}`}>
                        <strong>{resources.currentPrices.bid_price_gpu_scale} </strong>
                        USD / GPU-month
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-12">
                  <Button type="primary" onClick={() => updatePrice()}>
                    Edit Pricing
                  </Button>
                </div>
              </div>
              <UpdatePricing showDrawer={showDrawer} onCloseDrawer={() => setDrawer(false)} />
              <Divider />
            </>
          )}
        </div>
      )}
    </>
  )
}

const mapStateToProps = ({ resources, dispatch }) => ({
  dispatch,
  resources,
})

export default connect(mapStateToProps)(ProviderPricing)
