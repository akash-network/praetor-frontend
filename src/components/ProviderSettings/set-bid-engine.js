import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, InputNumber, Divider, Card } from 'antd'
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons'
import style from './style.module.scss'

const SetBidEngine = ({
  onButtonClick,
  finalValues,
  providerConfig,
  persistentStorage,
  controlMachine,
}) => {
  const [form] = Form.useForm()
  const [additionalSettings, setAdditionalSettings] = React.useState(false)
  const [cpuInput, setCpuInput] = React.useState(1.6)
  const [memoryInput, setMemoryInput] = React.useState(0.8)
  const [storageInput, setStorageInput] = React.useState(0.02)
  const [persistentStorageInput, setPersistentStorageInput] = React.useState(0.3)
  const [priceCalculations, setPriceCalculations] = React.useState({
    cpuTotalPrice: 0,
    memoryTotalPrice: 0,
    storageTotalPrice: 0,
    peristentStorageTotalPrice: 0,
    totalPricePerMonth: 0,
    totalPersistentStorage: 0,
  })
  const [persistentTotalStorage, setPersistentTotalStorage] = React.useState(0)

  React.useEffect(() => {
    const cpuTotalPrice = (cpuInput * providerConfig.bidResources.cpu) / (100 / 80)
    const memoryTotalPrice =
      (memoryInput * providerConfig.bidResources.memory) / 1024 / 1024 / 1024 / (100 / 80)
    const storageTotalPrice =
      (storageInput * providerConfig.bidResources.storage) / 1024 / 1024 / 1024 / (100 / 80)

    let peristentStorageTotalPrice = 0
    let totalStorage = 0
    if (persistentStorage.enabled) {
      persistentStorage.activeDrives.forEach((drive) => {
        let convertedMB = 0
        if (drive.size.substr(drive.size.length - 1) === 'P') {
          convertedMB = Number(drive.size.slice(0, -1)) * 1024 * 1024 * 1024
        } else if (drive.size.substr(drive.size.length - 1) === 'T') {
          convertedMB = Number(drive.size.slice(0, -1)) * 1024 * 1024
        } else if (drive.size.substr(drive.size.length - 1) === 'G') {
          convertedMB = Number(drive.size.slice(0, -1)) * 1024
        }
        totalStorage += convertedMB
      })

      setPersistentTotalStorage(totalStorage)
      peristentStorageTotalPrice = (persistentStorageInput * totalStorage) / 1024 / (100 / 80)
    }

    const totalPricePerMonth =
      cpuTotalPrice + memoryTotalPrice + storageTotalPrice + peristentStorageTotalPrice

    setPriceCalculations({
      cpuTotalPrice,
      memoryTotalPrice,
      storageTotalPrice,
      peristentStorageTotalPrice,
      totalPricePerMonth,
    })
  }, [
    cpuInput,
    memoryInput,
    storageInput,
    persistentStorageInput,
    providerConfig.bidResources.cpu,
    providerConfig.bidResources.memory,
    providerConfig.bidResources.storage,
    persistentStorage,
  ])

  const format = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return [parseFloat((bytes / k ** i).toFixed(dm)), sizes[i]]
  }

  const onVerify = (values) => {
    finalValues.bidEngine = values
    finalValues.bidEngine.storageType = persistentStorage.storage.class

    if (persistentStorage.storage.class === 'beta1') {
      finalValues.bidEngine.bid_price_hd_pres_hdd_scale = values.persistentStorageInput
    }

    if (persistentStorage.storage.class === 'beta2') {
      finalValues.bidEngine.bid_price_hd_pres_ssd_scale = values.persistentStorageInput
    }

    if (persistentStorage.storage.class === 'beta3') {
      finalValues.bidEngine.bid_price_hd_pres_nvme_scale = values.persistentStorageInput
    }
    onButtonClick('setAttributes')
  }
  return (
    <div className="container-full">
      <div className="row">
        <div className="d-none d-sm-none d-md-block col-md-5 col-lg-5 col-xl-5">
          <div className="mt-2">
            <img
              src="/resources/images/content/provider_pricing.png"
              width="400"
              height="auto"
              alt="Provider Pricing"
              className={`${style.img_responsive}`}
            />
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-5 col-lg-4 col-xl-4">
          <div className="row">
            <div className="col-11">
              <Form
                requiredMark="optional"
                className="white_background"
                name="basic"
                layout="vertical"
                onFinish={onVerify}
                form={form}
                autoComplete="off"
                initialValues={{
                  cpuInput,
                  memoryInput,
                  storageInput,
                  persistentStorageInput,
                  bidPriceEndpointScale: 0.05,
                  bidPriceIpScale: 5,
                  bidPriceGPUScale: 100,
                  bidDeposit: 500000,
                }}
              >
                <div className="row mb-5">
                  <div className="col-md-12">
                    <h1 className={style.provider_pricing_title}>Provider Pricing</h1>
                    <span>Set Provider Pricing to earn rewards</span>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-12">
                    <Form.Item
                      name="cpuInput"
                      label={<div className={style.label}>CPU Scale Bid Price</div>}
                      rules={[{ required: true, message: 'CPU Scale Bid Price is required' }]}
                    >
                      <InputNumber
                        min={0}
                        step={1}
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
                      name="persistentStorageInput"
                      label={<div className={style.label}>Persistent Storage Scale Bid Price</div>}
                      rules={[
                        {
                          required: true,
                          message: 'Persistent Storage Scale Bid Price is required',
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        step={0.1}
                        className={style.input_number}
                        onChange={(value) => setPersistentStorageInput(value)}
                        value={persistentStorageInput}
                        addonAfter="USD / GB-month"
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </div>
                {controlMachine.gpu && (
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Item
                        name="bidPriceGPUScale"
                        label={<div className={style.label}>GPU Scale Bid Price</div>}
                        rules={[
                          {
                            required: true,
                            message: 'GPU Scale Bid Price is required',
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          step={1}
                          className={style.input_number}
                          addonAfter="USD / unit-month"
                          size="large"
                        />
                      </Form.Item>
                    </div>
                  </div>
                )}
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
                        name="bidPriceIpScale"
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
                          value={persistentStorageInput}
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
                          addonAfter="USD / Port-month"
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
                    <Button htmlType="submit" size="large" className={`${style.connect_button}`}>
                      Next
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
            <div className="d-none d-sm-none d-md-block col-md-1 col-lg-1 col-xl-1 pl-0">
              <Divider
                type="vertical"
                style={{
                  height: additionalSettings ? '52em' : '38em',
                  borderRight: '2px solid #ff7043',
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-12 col-md-2 col-lg-3 col-xl-3">
          <div className="row">
            <div className="col-12 pl-3 pr-0">
              <h3>Resources</h3>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-3">
              <Card size="small" title="CPU" style={{ minWidth: 80 }}>
                <strong>{providerConfig.bidResources.cpu}</strong>
              </Card>
            </div>
            <div className="col-3">
              <Card size="small" title="Memory" style={{ minWidth: 80 }}>
                <strong>{format(providerConfig.bidResources.memory)}</strong>
              </Card>
            </div>
            <div className="col-3">
              <Card size="small" title="Storage" style={{ minWidth: 80 }}>
                <strong>{format(providerConfig.bidResources.storage)}</strong>
              </Card>
            </div>
            <div className="col-3">
              <Card size="small" title="Persistent Storage" style={{ minWidth: 80 }}>
                <strong>{format(persistentTotalStorage * 1024 * 1024)}</strong>
              </Card>
            </div>
          </div>
          <div className="row mt-5">
            <div className={`col-12 pl-3 pr-0 ${style.estimated_earnings}`}>
              <h3>Estimated Monthly Earnings</h3>
              <span>The earnings are estimated and based on 80% resource utilization</span>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12">
              <Card style={{ minWidth: 200 }}>
                <div>
                  Total Estimated <br />
                  Earnings
                </div>
                <div className={`${style.attributes_font}`}>
                  <strong>{priceCalculations.totalPricePerMonth.toFixed(2)}</strong> USD
                </div>
                / month
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({
  dispatch,
  user,
  providerConfig,
  persistentStorage,
  controlMachine,
}) => ({
  user,
  dispatch,
  providerConfig,
  persistentStorage,
  controlMachine,
})

export default connect(mapStateToProps)(SetBidEngine)
