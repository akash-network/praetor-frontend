import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Input, Divider } from 'antd'
import { remove as removeKey, find } from 'lodash'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import style from './style.module.scss'

const AddAttributes = ({ finalValues, user, dispatch, persistentStorage }) => {
  const [form] = Form.useForm()
  const [width, setWidth] = React.useState(window.innerWidth)

  React.useEffect(() => {
    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth
      setWidth(newWidth)
    }

    window.addEventListener('resize', updateWindowDimensions)

    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [])

  const [providerExistingAttributes, setExistingAttributes] = React.useState(null)
  const [attributesInitiated, setAttributeInitiated] = React.useState(false)

  React.useEffect(() => {
    const existingAttributes = user.provider.data.attributes
    const existKeyArch = find(existingAttributes, { key: 'arch' })
    if (typeof existKeyArch !== 'undefined') {
      removeKey(existingAttributes, { key: 'arch' })
    }
    const existKeyOrganization = find(existingAttributes, {
      key: 'organization',
    })
    if (typeof existKeyOrganization !== 'undefined') {
      removeKey(existingAttributes, { key: 'organization' })
    }
    setExistingAttributes(existingAttributes)
    setAttributeInitiated(true)
  }, [user.provider.data.attributes])

  const onFinish = (providerAttributes) => {
    finalValues.providerAttributes = providerAttributes
    if (persistentStorage.enabled) {
      finalValues.update = true
    }
    dispatch({
      type: 'providerConfig/BECOME_PROVIDER',
      payload: finalValues,
    })
  }
  const updateAttributes = () => {
    finalValues.update = true
  }

  return (
    <div className="col-12 col-sm-8 col-md-8 col-lg-7 col-xl-6">
      <div className={`container margin-adjust ${style.container}`}>
        {attributesInitiated && (
          <Form
            name="addAttributeForm"
            initialValues={{ attributes: providerExistingAttributes }}
            onFinish={onFinish}
            onValuesChange={updateAttributes}
            layout="vertical"
            autoComplete="off"
            form={form}
          >
            <div className="row mb-5">
              <div className="col-md-12">
                <h1 className={style.h1}>Provider Attributes</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.List name="attributes">
                  {(fields, { add, remove }) => (
                    <div className="col-12 pl-0">
                      {fields.map(({ key, name, ...restField }) => (
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
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
                                {
                                  pattern: new RegExp('^((?!arch).)*$'),
                                  message:
                                    '"arch" key is not allowed here. "arch" key will be added automatically.',
                                },
                                {
                                  pattern: new RegExp('^((?!organization).)*$'),
                                  message: 'organization key is not allowed here',
                                },
                              ]}
                            >
                              <Input placeholder="Key" className={style.inputAttributeForm} />
                            </Form.Item>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
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
                      <div className="mt-2">
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
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </Form.List>
              </div>
            </div>
          </Form>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = ({ dispatch, user, persistentStorage }) => ({
  user,
  dispatch,
  persistentStorage,
})

export default connect(mapStateToProps)(AddAttributes)
