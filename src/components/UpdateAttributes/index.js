import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Input, Divider, Drawer, notification } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { signin, updateProvider } from 'services/akash'
import style from './style.module.scss'

const generticErrorMessage = 'Error Occurred, Please try again!'

const notifyError = (error = { message: generticErrorMessage }) => {
  notification.error({
    duration: 10,
    message: error.message,
  })
}

const UpdateAttributes = ({ showDrawer, onCloseDrawer, dispatch, chain, resources }) => {
  const [size, setSize] = useState()
  const [form] = Form.useForm()
  const [width, setWidth] = useState(window.innerWidth)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth
      setWidth(newWidth)
    }

    window.addEventListener('resize', updateWindowDimensions)

    return () => window.removeEventListener('resize', updateWindowDimensions)
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

  useEffect(() => {
    setSize('large')
  }, [])

  const closeDrawer = () => {
    onCloseDrawer()
    dispatch({
      type: 'resources/SET_STATE',
      payload: {
        sessionUpdated: false,
      },
    })
  }
  const onFinish = async (values) => {
    try {
      const existingAttributes = resources.providerDetails
      existingAttributes.provider_attributes.attributes = values.attributes
      setLoading(true)

      const selectedChain = JSON.parse(chain.selectedChain)

      const { signingClient, address } = await signin(selectedChain)
      const request = {
        hostUri: resources.providerDetails.provider_attributes.host_uri,
        signingClient,
        attributes: values.attributes,
        address,
      }
      const signedMessage = await updateProvider(request)
      if (signedMessage) {
        dispatch({
          type: 'resources/SET_STATE',
          payload: {
            providerDetails: existingAttributes,
          },
        })
        dispatch({
          type: 'resources/UPDATE_ATTRIBUTES',
          payload: {
            attributes: values.attributes,
          },
        })
        setLoading(false)
        notification.success({
          message: 'Success! Provider Attributes updated!',
        })
        closeDrawer()
      }
    } catch (error) {
      notifyError(error)
      setLoading(false)
    }
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
              <h1 className={style.h1}>Update Attributes</h1>
              <span className="mt-2">Update attributes to let users know about your provider.</span>
            </div>
          </div>
          <Divider />
          <div className="row mt-5">
            <Form
              name="dynamic_form_nest_item"
              initialValues={{
                attributes: resources.providerDetails.provider_attributes.attributes,
              }}
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
              form={form}
            >
              <div className="col-12">
                <Form.List name="attributes">
                  {(fields, { add, remove }) => (
                    <div className="col-12 pl-0">
                      {fields.map(({ key, name, ...restField }) => (
                        <div className="row" key={key}>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5">
                            <Form.Item
                              {...restField}
                              key={key}
                              name={[name, 'key']}
                              label={<div className={style.label}>Key</div>}
                              rules={[
                                {
                                  required: true,
                                  message: 'Key is required',
                                },
                              ]}
                            >
                              <Input placeholder="Key" className={style.inputAttributeForm} />
                            </Form.Item>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                            <Form.Item
                              {...restField}
                              key={key}
                              name={[name, 'value']}
                              label={<div className={style.label}>Value</div>}
                              rules={[{ required: true, message: 'Value is required' }]}
                            >
                              <Input placeholder="Value" className={style.inputAttributeForm} />
                            </Form.Item>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1 text-center">
                            <div className="align-middle">
                              {fields.length >= 0 &&
                                (width > 991 ? (
                                  <MinusCircleOutlined key={key} onClick={() => remove(name)} />
                                ) : (
                                  <Button key={key} onClick={() => remove(name)}>
                                    Remove
                                  </Button>
                                ))}
                            </div>
                          </div>
                          <Divider className="col-12 col-sm-12 col-md-12 d-lg-none d-xl-none" />
                        </div>
                      ))}
                      <div className="mt-4">
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          className={`${style.add_button}`}
                          icon={<PlusOutlined />}
                        >
                          Add More
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className={`ml-3 ${style.yes_button}`}
                          loading={loading}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  )}
                </Form.List>
              </div>
            </Form>
          </div>
        </div>
      </Drawer>
    </>
  )
}

const mapStateToProps = ({ dispatch, chain, resources }) => ({
  dispatch,
  chain,
  resources,
})

export default connect(mapStateToProps)(UpdateAttributes)
