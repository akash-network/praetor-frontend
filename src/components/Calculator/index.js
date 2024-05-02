import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Card, Divider, InputNumber, Slider, Switch } from 'antd'
import style from './style.module.scss'
import 'antd/dist/antd.css'

const redAkashLogo = '/resources/images/logo/akash.svg'

const Calculator = () => {
  const [aktAverage, setAktAverage] = useState(true)
  const [leasePercentInput, setLeasePercentInput] = useState(100)
  const [cpuInput, setCpuInput] = useState(10)
  const [memoryInput, setMemoryInput] = useState(256)
  const [storageInput, setStorageInput] = useState(1024)
  const [persistentStorageInput, setPersistentStorageInput] = useState(1024)
  const [gpuInput, setGPUInput] = useState(1)
  const [ipInput, setIpInput] = useState(1)
  const [endpointInput, setEndpointInput] = useState(1)

  const [usdPrices, setUsdPrices] = useState({
    cpuTotalPrice: 0,
    memoryTotalPrice: 0,
    storageTotalPrice: 0,
    gpuTotalPrice: 0,
    persistenStorageTotalPrice: 0,
    totalPrices: 0,
    ipTotalPrice: 0,
    endpointTotal: 0,
  })

  const [cpuPricing, setCpuPricing] = useState(1.6)
  const [memoryPricing, setMemoryPricing] = useState(0.8)
  const [storagePricing, setStoragePricing] = useState(0.02)
  const [persistentStoragePricing, setPersistentStoragePricing] = useState(0.04)
  const [gpuPricing, setGPUPricing] = useState(100)
  const [ipPricing, setIpPricing] = useState(5)
  const [endpointPrice, setEndpointPrice] = useState(0.05)

  const [usdPrice, setUsdPrice] = useState(0)
  const [monthlyAverage, setMonthlyAverage] = useState(0)

  useEffect(() => {
    let currentPrice = 0.0
    let averagePrice = 0.0
    fetch('https://api.coingecko.com/api/v3/coins/akash-network/tickers')
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.tickers.length; i += 1) {
          if (data.tickers[i].market.name === 'Coinbase Exchange') {
            currentPrice = data.tickers[i].converted_last.usd
            setUsdPrice(data.tickers[i].converted_last.usd)
            break
          }
        }
      })
    fetch(
      'https://api.coingecko.com/api/v3/coins/akash-network/market_chart?vs_currency=usd&days=30&interval=daily',
    )
      .then((response) => response.json())
      .then((data) => {
        const mean = _.meanBy(data.prices, (o) => {
          return o[1]
        })
        averagePrice = mean
        if (currentPrice > averagePrice) {
          setAktAverage(false)
        }
        setMonthlyAverage(mean)
      })
  }, [])

  useEffect(() => {
    const cpuTotalPrice = (cpuInput * cpuPricing) / (100 / leasePercentInput)
    const memoryTotalPrice = (memoryInput * memoryPricing) / (100 / leasePercentInput)
    const storageTotalPrice = (storageInput * storagePricing) / (100 / leasePercentInput)
    const persistenStorageTotalPrice =
      (persistentStorageInput * persistentStoragePricing) / (100 / leasePercentInput)
    const gpuTotalPrice = (gpuPricing * gpuInput) / (100 / leasePercentInput)
    const ipTotalPrice = (ipPricing * ipInput) / (100 / leasePercentInput)
    const endpointTotal = (endpointInput * endpointPrice) / (100 / leasePercentInput)

    const totalPrice =
      cpuTotalPrice +
      memoryTotalPrice +
      storageTotalPrice +
      persistenStorageTotalPrice +
      gpuTotalPrice +
      ipTotalPrice +
      endpointTotal

    setUsdPrices({
      cpuTotalPrice,
      memoryTotalPrice,
      storageTotalPrice,
      persistenStorageTotalPrice,
      gpuTotalPrice,
      totalPrice,
      ipTotalPrice,
      endpointTotal,
    })
  }, [
    cpuInput,
    memoryInput,
    storageInput,
    cpuPricing,
    memoryPricing,
    storagePricing,
    persistentStorageInput,
    persistentStoragePricing,
    leasePercentInput,
    gpuInput,
    gpuPricing,
    ipInput,
    ipPricing,
    endpointInput,
    endpointPrice,
  ])

  const calculateAKTPrice = (usdValue) => {
    return (aktAverage ? usdValue / monthlyAverage : usdValue / usdPrice).toFixed(2)
  }

  return (
    <div className={`${style.background}`}>
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
            <h1 className={style.h1}>Akash Provider Calculator</h1>
            <div className="">
              Use this calculator to calculate how much you will earn if you provide your compute
              power to Akash. <br />
              We are using recent Osmosis price for AKT to USD calculation. <br />
              <div className="row mt-4">
                <div className="col-md-12">Use 30 days average or current AKT price</div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {aktAverage && 'Average'}
                  {!aktAverage && 'Current'} Price for 1 AKT is{' '}
                  <strong>
                    ${aktAverage && monthlyAverage.toFixed(3)}
                    {!aktAverage && usdPrice.toFixed(3)}
                  </strong>{' '}
                  USD. <br />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-12">
                  <div className="switchButton">
                    <Switch
                      checkedChildren="Average"
                      unCheckedChildren="Current"
                      checked={aktAverage}
                      onChange={(value) => setAktAverage(value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12">
            <h4 style={{ fontWeight: '600' }}>Provider Utilization</h4>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <div className="antd-label">Usage %(Leases in your provider)</div>
            <Slider
              min={1}
              max={100}
              defaultValue={100}
              onChange={(value) => setLeasePercentInput(value)}
              value={leasePercentInput}
            />
            <div className="mt-3">
              <InputNumber
                size="large"
                className={`${style.inputNumber}`}
                placeholder="CPU"
                max={100}
                value={leasePercentInput}
                onChange={(value) => setLeasePercentInput(value)}
                addonAfter="% Filled"
              />
            </div>
          </div>
        </div>
        <Divider />

        <div className="row mt-5">
          <div className="col-12">
            <h4 style={{ fontWeight: '600' }}>Total Capacity / Pricing</h4>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <div className="row">
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">CPU</div>
                <Slider
                  min={1}
                  max={100}
                  onChange={(value) => setCpuInput(value)}
                  value={cpuInput}
                />
                <div className="mt-3">
                  <InputNumber
                    className={`${style.inputNumber}`}
                    min={1}
                    size="large"
                    placeholder="CPU"
                    value={cpuInput}
                    onChange={(value) => setCpuInput(value)}
                    addonAfter="vCPU"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">CPU Pricing</div>
                <div className="mt-3">
                  <InputNumber
                    className={`${style.inputNumber}`}
                    size="large"
                    min={0}
                    placeholder="CPU Pricing"
                    value={cpuPricing}
                    step={0.001}
                    onChange={(value) => setCpuPricing(value)}
                    defaultValue={1.6}
                    addonAfter="USD / thread-month"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <div className="row">
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">Memory</div>
                <Slider
                  min={1}
                  max={512}
                  defaultValue={10}
                  onChange={(value) => setMemoryInput(value)}
                  value={memoryInput}
                />
                <div className="mt-3">
                  <InputNumber
                    className={`${style.inputNumber}`}
                    min={1}
                    size="large"
                    placeholder="Memory"
                    onChange={(value) => setMemoryInput(value)}
                    defaultValue={10}
                    value={memoryInput}
                    addonAfter="Gi"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">Memory Pricing</div>
                <div className="mt-3">
                  <InputNumber
                    size="large"
                    className={`${style.inputNumber}`}
                    placeholder="Memory Pricing"
                    value={memoryPricing}
                    min={0}
                    step={0.0001}
                    onChange={(value) => setMemoryPricing(value)}
                    defaultValue={0.8}
                    addonAfter="USD / GB-month"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <div className="row">
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">Ephemeral Storage</div>
                <Slider
                  min={1}
                  max={10240}
                  defaultValue={100}
                  onChange={(value) => setStorageInput(value)}
                  value={storageInput}
                />
                <div className="mt-3">
                  <InputNumber
                    min={1}
                    className={`${style.inputNumber}`}
                    size="large"
                    placeholder="Ephemeral Storage"
                    onChange={(value) => setStorageInput(value)}
                    defaultValue={1024}
                    value={storageInput}
                    addonAfter="Gi"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">Storage Pricing</div>
                <div className="mt-3">
                  <InputNumber
                    size="large"
                    className={`${style.inputNumber}`}
                    placeholder="Storage Pricing"
                    min={0}
                    step={0.00001}
                    value={storagePricing}
                    onChange={(value) => setStoragePricing(value)}
                    addonAfter="USD / GB-month"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-sm-6 col-xs-12">
            <div className="row">
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">Persistent Storage</div>
                <Slider
                  min={0}
                  max={10240}
                  defaultValue={1024}
                  onChange={(value) => setPersistentStorageInput(value)}
                  value={persistentStorageInput}
                />
                <div className="mt-3">
                  <InputNumber
                    min={0}
                    className={`${style.inputNumber}`}
                    size="large"
                    placeholder="Storage"
                    onChange={(value) => setPersistentStorageInput(value)}
                    defaultValue={100}
                    value={persistentStorageInput}
                    addonAfter="Gi"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">Persistent Storage Pricing</div>
                <div className="mt-3">
                  <InputNumber
                    size="large"
                    className={`${style.inputNumber}`}
                    placeholder="Persistent Storage Pricing"
                    min={0}
                    step={0.00001}
                    value={persistentStoragePricing}
                    onChange={(value) => setPersistentStoragePricing(value)}
                    addonAfter="USD / GB-month"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-sm-6 col-xs-12">
            <div className="row">
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">GPUs</div>
                <Slider
                  min={0}
                  max={100}
                  defaultValue={1}
                  onChange={(value) => setGPUInput(value)}
                  value={gpuInput}
                />
                <div className="mt-3">
                  <InputNumber
                    min={0}
                    className={`${style.inputNumber}`}
                    size="large"
                    placeholder="GPUs"
                    onChange={(value) => setGPUInput(value)}
                    defaultValue={1}
                    value={gpuInput}
                    addonAfter="Unit"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">GPU Pricing</div>
                <div className="mt-3">
                  <InputNumber
                    size="large"
                    className={`${style.inputNumber}`}
                    placeholder="GPU Pricing"
                    min={0}
                    step={1}
                    value={gpuPricing}
                    onChange={(value) => setGPUPricing(value)}
                    addonAfter="USD / unit-month"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-sm-6 col-xs-12">
            <div className="row">
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">IPs</div>
                <Slider
                  min={0}
                  max={100}
                  defaultValue={1}
                  onChange={(value) => setIpInput(value)}
                  value={ipInput}
                />
                <div className="mt-3">
                  <InputNumber
                    min={0}
                    className={`${style.inputNumber}`}
                    size="large"
                    placeholder="IPs"
                    onChange={(value) => setIpInput(value)}
                    defaultValue={1}
                    value={gpuInput}
                    addonAfter="Unit"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">IP Pricing</div>
                <div className="mt-3">
                  <InputNumber
                    size="large"
                    className={`${style.inputNumber}`}
                    placeholder="IP Pricing"
                    min={0}
                    step={1}
                    value={ipPricing}
                    onChange={(value) => setIpPricing(value)}
                    addonAfter="USD / unit-month"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mt-3 col-sm-6 col-xs-12">
            <div className="row">
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">Endpoints</div>
                <Slider
                  min={0}
                  max={100}
                  defaultValue={1}
                  onChange={(value) => setEndpointInput(value)}
                  value={endpointInput}
                />
                <div className="mt-3">
                  <InputNumber
                    min={0}
                    className={`${style.inputNumber}`}
                    size="large"
                    placeholder="Storage"
                    onChange={(value) => setEndpointInput(value)}
                    defaultValue={1}
                    value={endpointInput}
                    addonAfter="Unit"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 mt-3 col-xs-12 col-sm-12">
                <div className="antd-label">Endpoint Pricing</div>
                <div className="mt-3">
                  <InputNumber
                    size="large"
                    className={`${style.inputNumber}`}
                    placeholder="IP Pricing"
                    min={0}
                    step={1}
                    value={endpointPrice}
                    onChange={(value) => setEndpointPrice(value)}
                    addonAfter="USD / port-month"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Divider />

        <div className="row mt-5">
          <div className="col-12">
            <h4 style={{ fontWeight: '600' }}>Estimate Breakdown</h4>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <Card style={{ minWidth: 200 }}>
              <div>
                Total CPU <br />
                Earnings
              </div>
              <div className={`${style.attributes_font}`}>
                <strong>{usdPrices.cpuTotalPrice.toFixed(2)}</strong> USD
              </div>
              <div>/ month</div>
            </Card>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <Card style={{ minWidth: 200 }}>
              <div>
                Total Memory <br />
                Earnings
              </div>
              <div className={`${style.attributes_font}`}>
                <strong>{usdPrices.memoryTotalPrice.toFixed(2)}</strong> USD
              </div>
              <div>/ month</div>
            </Card>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <Card style={{ minWidth: 200 }}>
              <div>
                Total Storage <br />
                Earnings
              </div>
              <div className={`${style.attributes_font}`}>
                <strong>{usdPrices.storageTotalPrice.toFixed(2)}</strong> USD
              </div>
              <div>/ month</div>
            </Card>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <Card style={{ minWidth: 200 }}>
              <div>
                Total Persistent Storage <br /> Earnings
              </div>
              <div className={`${style.attributes_font}`}>
                <strong>{usdPrices.persistenStorageTotalPrice.toFixed(2)}</strong> USD
              </div>
              <div>/ month</div>
            </Card>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <Card style={{ minWidth: 200 }}>
              <div>
                Total GPU <br /> Earnings
              </div>
              <div className={`${style.attributes_font}`}>
                <strong>{usdPrices.gpuTotalPrice.toFixed(2)}</strong> USD
              </div>
              <div>/ month</div>
            </Card>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <Card style={{ minWidth: 200 }}>
              <div>
                Total IP <br /> Earnings
              </div>
              <div className={`${style.attributes_font}`}>
                <strong>{usdPrices.ipTotalPrice.toFixed(2)}</strong> USD
              </div>
              <div>/ month</div>
            </Card>
          </div>
          <div className="col-lg-3 col-md-6 mt-3 col-xs-12 col-sm-6">
            <Card style={{ minWidth: 200 }}>
              <div>
                Total Endpoint <br /> Earnings
              </div>
              <div className={`${style.attributes_font}`}>
                <strong>{usdPrices.endpointTotal.toFixed(2)}</strong> USD
              </div>
              <div>/ month</div>
            </Card>
          </div>
        </div>
        <Divider />
        <div className="row mt-5">
          <div className="col-12">
            <h4 style={{ fontWeight: '600' }}>Estimated Earnings</h4>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-4 col-md-4 mt-3 col-xs-12 col-sm-6">
            <Card style={{ minWidth: 200 }}>
              <div>Total Monthly Earnings in USD</div>
              <div className={`${style.attributes_font}`}>
                <strong>{usdPrices?.totalPrice?.toFixed(2)}</strong> USD
              </div>
              <div>/ month</div>
            </Card>
          </div>
          <div className="col-lg-4 col-md-4 mt-3 col-xs-12 col-sm-6">
            <Card style={{ minWidth: 200 }}>
              <div>Total Monthly Earnings in AKT</div>
              <div className={`${style.attributes_font}`}>
                <strong>{calculateAKTPrice(usdPrices.totalPrice)}</strong> AKT
              </div>
              <div>/ month</div>
            </Card>
          </div>
        </div>
        <Divider />
        <div className="row">
          <div className="col-12">
            Use <a href="/">Praetor App</a> to become an Akash provider. This estimates based on
            current block generation timing (Estimated 1 block every 6 seconds). <br />
            Please support is by delegating AKT -{' '}
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
    </div>
  )
}

const mapStateToProps = ({ dispatch }) => ({
  dispatch,
})

export default connect(mapStateToProps)(Calculator)
