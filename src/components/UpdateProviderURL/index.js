import { Form, Input, Drawer, Button, Divider } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import style from './style.module.scss'

const UpdateProviderUrl = ({ showDrawer, onCloseDrawer, dispatch, resources }) => {
  const [form] = Form.useForm()
  const [size, setSize] = useState()
  const [providerDomain, setProviderDomain] = useState(
    resources.providerDetails?.provider_attributes.host_uri,
  )

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

  const closeDrawer = () => {
    onCloseDrawer()
    dispatch({
      type: 'resources/SET_STATE',
      payload: {
        sessionUpdated: false,
      },
    })
  }

  useEffect(() => {
    if (showDrawer) {
      form.resetFields()
    }
  }, [showDrawer, form])

  const onFinish = (values) => {
    dispatch({
      type: 'resources/UPDATE_URL',
      payload: {
        values,
      },
    })
  }

  const changeProviderUrl = (event) => {
    setProviderDomain(event.target.value)
  }

  const formatClusterURL = (clusterIp) => {
    if (clusterIp.startsWith('provider.')) {
      return clusterIp.substring(9)
    }
    return clusterIp
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
              <h1 className={style.h1}>Update Provider Url</h1>
              <span className="mt-2">
                Change this url if you are changing your domain name or server configuration.
              </span>
            </div>
          </div>
          <Divider />
          <div className="row mt-2">
            <div className="col-12">
              <Form
                requiredMark="optional"
                className="white_background"
                name="basic"
                layout="vertical"
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{
                  providerDomain: formatClusterURL(
                    resources.providerDetails?.cluster_public_hostname,
                  ),
                }}
              >
                <div className="row mt-4">
                  <div className="col-12">
                    <Form.Item
                      name="providerDomain"
                      label={<div className={style.label}>Provider Domain </div>}
                      rules={[{ required: true, message: 'Provider Domain is required' }]}
                    >
                      <Input
                        className={style.input}
                        value={providerDomain}
                        onChange={(event) => changeProviderUrl(event)}
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-12">
                    Note: Please update DNS settings before you update here.
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12 col-md-4 col-lg-4 col-xl-4">
                    <Button
                      htmlType="submit"
                      size="large"
                      loading={resources.processLoading}
                      className={`${style.connect_button}`}
                    >
                      Update
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

export default connect(mapStateToProps)(UpdateProviderUrl)
