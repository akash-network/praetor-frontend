import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form, InputNumber, Drawer, Divider } from 'antd'
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons'

import style from './style.module.scss'

const UpdatePricing = ({ showDrawer, onCloseDrawer, dispatch, resources }) => {
  const [size, setSize] = useState()
  const [form] = Form.useForm()
  const [additionalSettings, setAdditionalSettings] = useState(false)
  const [cpuInput, setCpuInput] = useState(0.014)
  const [memoryInput, setMemoryInput] = useState(0.005)
  const [storageInput, setStorageInput] = useState(0.0005)

  useEffect(() => {
    setSize('large')
  }, [])

  useEffect(() => {
    if (resources.processUpdated && showDrawer) {
      onCloseDrawer()
      dispatch({
        type: 'resources/SET_STATE',
        payload: {
          processUpdated: false,
        },
      })
    }
  }, [resources.processUpdated, onCloseDrawer, dispatch, showDrawer])

  useEffect(() => {
    if (showDrawer) {
      form.resetFields()
    }
  }, [showDrawer, form])

  const closeDrawer = () => {
    onCloseDrawer()
    dispatch({
      type: 'resources/SET_STATE',
      payload: {
        sessionUpdated: false,
      },
    })
  }
  const onFinish = (values) => {
    dispatch({
      type: 'resources/UPDATE_PRICES',
      payload: {
        values,
        attributes: resources.providerDetails.provider_attributes.attributes,
      },
    })
  }

  return (
    <>
      <Drawer
        placement="right"
        size={size}
        onClose={closeDrawer}
        visible={showDrawer}
        className="custom-drawer"
        keyboard={false}
        maskClosable={false}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className={style.h1}>Update Pricing</h1>
              <span className="mt-2">
                This will change provider pricing for new leases. Old leases will use old pricing.
              </span>
            </div>
          </div>
          <Divider />
          <div className="row mt-5">
            <div className="col-12">
              <Form
                requiredMark="optional"
                className="white_background"
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                form={form}
                autoComplete="off"
                initialValues={{
                  cpuInput: resources.currentPrices.bid_price_cpu_scale,
                  memoryInput: resources.currentPrices.bid_price_memory_scale,
                  storageInput: resources.currentPrices.bid_price_storage_scale,
                  persistentStorageHDDInput: resources.currentPrices.bid_price_hd_pres_hdd_scale,
                  persistentStorageSSDInput: resources.currentPrices.bid_price_hd_pres_ssd_scale,
                  persistentStorageNVMEInput: resources.currentPrices.bid_price_hd_pres_nvme_scale,
                  ipScaleInput: resources.currentPrices.bid_price_ip_scale,
                  gpuScaleInput: resources.currentPrices.bid_price_gpu_scale,
                  bidPriceEndpointScale: 0,
                  bidDeposit: 500000,
                }}
              >
                <div className="row mt-4">
                  <div className="col-md-12">
                    <Form.Item
                      name="cpuInput"
                      label={<div className={style.label}>CPU Scale Bid Price</div>}
                      rules={[{ required: true, message: 'CPU Scale Bid Price is required' }]}
                    >
                      <InputNumber
                        min={0}
                        step={0.1}
                        className={style.input_number}
                        onChange={(value) => setCpuInput(value)}
                        value={cpuInput}
                        addonAfter="USD / thread-month"
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Form.Item
                      name="memoryInput"
                      label={<div className={style.label}>Memory Scale Bid Price</div>}
                      rules={[{ required: true, message: 'Memory Scale Bid Price is required' }]}
                    >
                      <InputNumber
                        min={0}
                        step={0.1}
                        className={style.input_number}
                        onChange={(value) => setMemoryInput(value)}
                        value={memoryInput}
                        addonAfter="USD / GB-month"
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Form.Item
                      name="storageInput"
                      label={<div className={style.label}>Storage Scale Bid Price</div>}
                      rules={[{ required: true, message: 'Storage Scale Bid Price is required' }]}
                    >
                      <InputNumber
                        min={0}
                        step={0.1}
                        className={style.input_number}
                        onChange={(value) => setStorageInput(value)}
                        value={storageInput}
                        addonAfter="USD / GB-month"
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Form.Item
                      name="gpuScaleInput"
                      label={<div className={style.label}>GPU Scale Bid Price</div>}
                      rules={[{ required: true, message: 'Storage Scale Bid Price is required' }]}
                    >
                      <InputNumber
                        min={0}
                        step={0.1}
                        className={style.input_number}
                        addonAfter="USD / GPU-month"
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="row mt-3 mb-3">
                  <div className="col-md-12">
                    <a
                      className={style.advance}
                      role="link"
                      tabIndex={0}
                      onClick={() => setAdditionalSettings(!additionalSettings)}
                      onKeyDown={() => setAdditionalSettings(!additionalSettings)}
                    >
                      Advance Settings &nbsp;
                      {!additionalSettings && <ArrowRightOutlined />}
                      {additionalSettings && <ArrowDownOutlined />}
                    </a>
                  </div>
                </div>
                <div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Item
                        name="persistentStorageHDDInput"
                        label={
                          <div className={style.label}>Persistent Storage HDD Scale Bid Price</div>
                        }
                        rules={[
                          {
                            required: true,
                            message: 'Persistent Storage HDD Scale Bid Price is required',
                          },
                        ]}
                        style={!additionalSettings ? { display: 'none' } : ''}
                      >
                        <InputNumber
                          min={0}
                          step={0.1}
                          className={style.input_number}
                          addonAfter="USD / GB-month"
                          size="large"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Item
                        name="persistentStorageSSDInput"
                        label={
                          <div className={style.label}>Persistent Storage SSD Scale Bid Price</div>
                        }
                        rules={[
                          {
                            required: true,
                            message: 'Persistent Storage SSD Scale Bid Price is required',
                          },
                        ]}
                        style={!additionalSettings ? { display: 'none' } : ''}
                      >
                        <InputNumber
                          min={0}
                          step={0.1}
                          className={style.input_number}
                          addonAfter="USD / GB-month"
                          size="large"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Item
                        name="persistentStorageNVMEInput"
                        label={
                          <div className={style.label}>Persistent Storage NVME Scale Bid Price</div>
                        }
                        rules={[
                          {
                            required: true,
                            message: 'Persistent Storage NVME Scale Bid Price is required',
                          },
                        ]}
                        style={!additionalSettings ? { display: 'none' } : ''}
                      >
                        <InputNumber
                          min={0}
                          step={0.1}
                          className={style.input_number}
                          addonAfter="USD / GB-month"
                          size="large"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Item
                        name="ipScaleInput"
                        label={<div className={style.label}>IP Scale Price</div>}
                        rules={[
                          {
                            required: true,
                            message: 'IP Scale Price is required',
                          },
                        ]}
                        style={!additionalSettings ? { display: 'none' } : ''}
                      >
                        <InputNumber
                          min={0}
                          step={1}
                          className={style.input_number}
                          addonAfter="USD / IP-month"
                          size="large"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Item
                        name="bidPriceEndpointScale"
                        label={<div className={style.label}>Endpoint Bid Price</div>}
                        rules={[{ required: true, message: 'Endpoint Bid Price is required' }]}
                        style={!additionalSettings ? { display: 'none' } : ''}
                      >
                        <InputNumber
                          min={0}
                          step={0.1}
                          className={style.advance_settings}
                          size="large"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Item
                        name="bidDeposit"
                        label={<div className={style.label}>Bid Deposit</div>}
                        rules={[{ required: true, message: 'Bid Deposit is required' }]}
                        style={!additionalSettings ? { display: 'none' } : ''}
                      >
                        <InputNumber className={style.advance_settings} size="large" />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-4 col-lg-4 col-xl-4">
                    <Button
                      htmlType="submit"
                      size="large"
                      loading={resources.processLoading}
                      className={`${style.connect_button}`}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}
const mapStateToProps = ({ dispatch, resources }) => ({
  dispatch,
  resources,
})

export default connect(mapStateToProps)(UpdatePricing)
