import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Table } from 'antd'
import Swal from 'sweetalert2'
import { InfoCircleOutlined } from '@ant-design/icons'
import withReactContent from 'sweetalert2-react-content'
import style from './style.module.scss'
import AddAttributes from './add-attribute'
import SetBidEngine from './set-bid-engine'

const MySwal = withReactContent(Swal)

const ProviderCompare = ({ compareList }) => {
  const columns = [
    {
      title: 'Attributes',
      dataIndex: 'name',
      key: 'name',
      render: (text, index) => {
        return <div className={index.compare ? 'text-success' : 'text-danger'}>{text}</div>
      },
    },
    {
      title: 'Old Value',
      dataIndex: 'oldValue',
      key: 'oldValue',
      render: (text, index) => {
        return <div className={index.compare ? 'text-success' : 'text-danger'}>{text}</div>
      },
    },
    {
      title: 'New Value',
      dataIndex: 'newValue',
      key: 'newValue',
      render: (text, index) => {
        return <div className={index.compare ? 'text-success' : 'text-danger'}>{text}</div>
      },
    },
  ]
  return (
    <div>
      <div>
        <Table columns={columns} dataSource={compareList} pagination={false} />
      </div>
      <div className="mt-3 mb-3">
        Update transaction is costly (~1 AKT).
        <br /> Do you want to continue?
      </div>
    </div>
  )
}

const ProviderSettings = ({ user, providerConfig, dispatch }) => {
  const [form] = Form.useForm()
  const [providerConfigStep, setProviderConfigStep] = React.useState('providerConfiguration')
  const [finalValues, setFinalValues] = React.useState(null)

  React.useEffect(() => {
    dispatch({
      type: 'providerConfig/BID_ENGINE_CUSTOMIZATION',
    })
  }, [dispatch])

  const onVerify = (values) => {
    values.providerDomain = `provider.${values.domainName.toLowerCase()}`
    values.ingressDomain = `ingress.${values.domainName.toLowerCase()}`
    values.domainName = values.domainName.toLowerCase()
    // Check if we need to send update: true or false
    if (user.provider.data) {
      // check organization is same or not
      let compareFlag = false
      if (
        user.provider.data.host_uri !== `https://${values.providerDomain}:8443` ||
        user.provider.data.attributes.find((o) => o.key === 'organization')?.value !==
          values.organizationName
      ) {
        compareFlag = true
      }

      if (compareFlag) {
        const tmpCompare = [
          {
            key: 1,
            name: 'Provider Domain',
            oldValue: user.provider.data.host_uri,
            newValue: `https://${values.providerDomain}:8443`,
            compare: user.provider.data.host_uri === `https://${values.providerDomain}:8443`,
          },
          {
            key: 2,
            name: 'Organization Name',
            oldValue:
              user.provider.data.attributes.find((o) => o.key === 'organization')?.value || '-',
            newValue: values.organizationName,
            compare:
              (user.provider.data.attributes.find((o) => o.key === 'organization')?.value ||
                '-') === values.organizationName,
          },
        ]
        new Promise((resolve) => {
          MySwal.fire({
            title: '<strong>Update Provider?</strong>',
            icon: 'warning',
            html: <ProviderCompare compareList={tmpCompare} />,
            showCloseButton: true,
            showCancelButton: true,
            showDenyButton: true,
            focusConfirm: false,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            denyButtonText: 'Continue without update',
            confirmButtonColor: '#ff7043',
            denyButtonColor: '#979798',
            width: 600,
          }).then((result) => {
            if (result.isConfirmed) {
              values.update = true
              resolve(values)
            } else if (result.isDenied) {
              values.update = false
              values.providerDomain = user.provider.data.host_uri
                .replace('https://', '')
                .replace(':8443', '')

              values.organizationName = user.provider.data.attributes.find(
                (o) => o.key === 'organization',
              ).value
              resolve(values)
            }
          })
        }).then((value) => {
          setFinalValues(value)
          setProviderConfigStep('bidCustomization')
        })
      } else {
        values.update = false
        setFinalValues(values)
        setProviderConfigStep('bidCustomization')
      }
    } else {
      values.update = false
      setFinalValues(values)
      setProviderConfigStep('bidCustomization')
    }
  }

  return (
    <div className={`${style.background_white}`}>
      {providerConfigStep !== 'bidCustomization' && (
        <div className="container-full">
          <div className="row">
            <div className="col-12 col-sm-4 col-md-4 col-lg-5 col-xl-6">
              <div className="mt-5">
                <img
                  src="/resources/images/content/kubernetes_config.png"
                  height="500"
                  alt="Master node access"
                  className={`${style.img_responsive}`}
                />
              </div>
            </div>
            {providerConfigStep === 'providerConfiguration' && (
              <div className="col-12 col-sm-8 col-md-8 col-lg-7 col-xl-6">
                <div className={`container margin-adjust ${style.container}`}>
                  <Form
                    requiredMark="optional"
                    className="mt-5 white_background"
                    name="basic"
                    layout="vertical"
                    onFinish={onVerify}
                    form={form}
                    autoComplete="off"
                    initialValues={{
                      bidPriceCpuScale: 0.004,
                      bidPriceMemoryScale: 0.002,
                      bidPriceStorageScale: 0.0002,
                      bidPriceEndpointScale: 0,
                      bidDeposit: 500000,
                    }}
                  >
                    <div className="row mb-5">
                      <div className="col-md-12">
                        <h1 className={style.h1}>Provider Configuration</h1>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <Form.Item
                          name="domainName"
                          label={<div className={style.label}>Domain Name </div>}
                          tooltip={{
                            title: 'Please use the domain name which you own',
                            placement: 'right',
                            overlayStyle: { maxWidth: 340 },
                            icon: <InfoCircleOutlined style={{ color: '#000000' }} />,
                          }}
                          rules={[
                            { required: true, message: 'Domain name is required!' },
                            {
                              pattern: new RegExp(
                                '^(www)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,10}(:[0-9]{1,5})?(\\*)?$',
                                'gm',
                              ),
                              message:
                                'Please enter a valid Domain Name and do not enter Http or Https in Domain Name',
                            },
                          ]}
                        >
                          <Input placeholder="Input domain name" className={style.input} />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <Form.Item
                          name="organizationName"
                          label={<div className={style.label}>Organization Name</div>}
                          rules={[{ required: true, message: 'Organization Name is required!' }]}
                        >
                          <Input placeholder="Input Organization Name" className={style.input} />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 col-md-4 col-lg-4 col-xl-4">
                        <Button
                          htmlType="submit"
                          size="large"
                          className={`${style.connect_button}`}
                          loading={providerConfig.loading}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            )}
            {providerConfigStep === 'setAttributes' && (
              <AddAttributes
                onButtonClick={(step) => setProviderConfigStep(step)}
                finalValues={finalValues}
              />
            )}
          </div>
        </div>
      )}
      {providerConfigStep === 'bidCustomization' && (
        <SetBidEngine
          onButtonClick={(step) => setProviderConfigStep(step)}
          finalValues={finalValues}
        />
      )}
    </div>
  )
}

const mapStateToProps = ({ user, providerConfig, dispatch }) => ({
  user,
  dispatch,
  providerConfig,
})
export default connect(mapStateToProps)(ProviderSettings)
