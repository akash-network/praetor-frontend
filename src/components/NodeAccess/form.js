import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Input, Divider, Tooltip } from 'antd'
import {
  MinusCircleOutlined,
  PlusOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons'
import style from './style.module.scss'

const NodeAccessForm = ({
  keyFileAccess,
  sameUsername,
  samePassword,
  dispatch,
  nodeAccess,
  onBackButtonClick,
}) => {
  const [width, setWidth] = useState(window.innerWidth)
  if (keyFileAccess) {
    samePassword = true
  }

  useEffect(() => {
    dispatch({
      type: 'nodeAccess/SET_STATE',
      payload: {
        loading: false,
        nodes: [],
      },
    })
    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth
      setWidth(newWidth)
    }

    window.addEventListener('resize', updateWindowDimensions)

    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [dispatch])

  const onFinish = (values) => {
    values.keyFileAccess = keyFileAccess
    values.samePassword = samePassword
    values.sameUsername = sameUsername
    dispatch({
      type: 'nodeAccess/NODE_ACCESS',
      payload: values,
    })
  }
  return (
    <div className="row">
      <div className="col-sm-12 col-md-7 col-lg-8 col-xl-9">
        <div className={`${style.form_content} pb-5 pt-5`}>
          <div className="container">
            <div className="row">
              <div className="col-12 mb-5">
                <h1 className={`${style.form_heading}`}>Nodes Access</h1>
                <span>Please provide private IP addresses only.</span>
              </div>
              <div className="col-12">
                <Form
                  name="dynamic_form_nest_item"
                  initialValues={{
                    nodes: nodeAccess.controlMachineIncluded
                      ? [{ name: '' }]
                      : [{ name: '' }, { name: '' }],
                  }}
                  onFinish={onFinish}
                  layout="vertical"
                  autoComplete="off"
                >
                  <div className="row">
                    <div className="col-12">
                      <Form.List name="nodes">
                        {(fields, { add, remove }) => (
                          <div className="col-12 pl-0">
                            {fields.map(({ key, name, ...restField }) => (
                              <div className="row align-items-center">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                  <Form.Item
                                    {...restField}
                                    key={key}
                                    name={[name, 'ip']}
                                    label={<div className={style.label}>Node Local IP Address</div>}
                                    rules={[{ required: true, message: 'Missing IP address' }]}
                                  >
                                    <Input placeholder="IP Address" className={style.input} />
                                  </Form.Item>
                                </div>
                                {!sameUsername && (
                                  <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
                                    <Form.Item
                                      key={key}
                                      {...restField}
                                      name={[name, 'username']}
                                      label={<div className={style.label}>Username </div>}
                                      rules={[{ required: true, message: 'Missing Username' }]}
                                    >
                                      <Input placeholder="Username" className={style.input} />
                                    </Form.Item>
                                  </div>
                                )}
                                {!samePassword && (
                                  <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
                                    <Form.Item
                                      key={key}
                                      {...restField}
                                      name={[name, 'password']}
                                      label={<div className={style.label}>Password </div>}
                                      rules={[{ required: true, message: 'Missing Password' }]}
                                    >
                                      <Input.Password
                                        placeholder="Password"
                                        className={style.input}
                                      />
                                    </Form.Item>
                                  </div>
                                )}
                                <div className="col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1">
                                  <div className="align-middle">
                                    {nodeAccess.controlMachineIncluded &&
                                      fields.length > 1 &&
                                      (width > 991 ? (
                                        <MinusCircleOutlined
                                          key={key}
                                          onClick={() => remove(name)}
                                        />
                                      ) : (
                                        <Button key={key} onClick={() => remove(name)}>
                                          Remove
                                        </Button>
                                      ))}

                                    {!nodeAccess.controlMachineIncluded &&
                                      fields.length > 2 &&
                                      (width > 991 ? (
                                        <MinusCircleOutlined
                                          key={key}
                                          onClick={() => remove(name)}
                                        />
                                      ) : (
                                        <Button key={key} onClick={() => remove(name)}>
                                          Remove
                                        </Button>
                                      ))}

                                    {nodeAccess.nodes.length !== 0 &&
                                      nodeAccess.nodes[key]?.connected && (
                                        <Tooltip
                                          placement="topLeft"
                                          title="Node connected successfully"
                                        >
                                          <CheckCircleFilled
                                            key={key}
                                            style={{ color: 'green', fontSize: '18px' }}
                                          />
                                        </Tooltip>
                                      )}
                                    {nodeAccess.nodes.length !== 0 &&
                                      !nodeAccess.nodes[key]?.connected && (
                                        <Tooltip
                                          placement="topLeft"
                                          title="Node connection error. Please provide private IP address and/or make sure your credentials are correct"
                                        >
                                          <CloseCircleFilled
                                            className={fields.length > 2 ? 'ml-3' : ''}
                                            key={key}
                                            style={{ color: 'red', fontSize: '18px' }}
                                          />
                                        </Tooltip>
                                      )}
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
                                loading={nodeAccess.loading}
                              >
                                Next
                              </Button>
                              {keyFileAccess && (
                                <Button
                                  className="ml-1"
                                  type="link"
                                  onClick={() => onBackButtonClick('username')}
                                >
                                  Back
                                </Button>
                              )}
                              {!keyFileAccess && (
                                <Button
                                  className="ml-1"
                                  type="link"
                                  onClick={() => onBackButtonClick('password')}
                                >
                                  Back
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </Form.List>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-none d-sm-none d-md-block col-md-5 col-lg-4 col-xl-3">
        <div className={`${style.form_image}`}>
          <div className="row">
            <div className="col-12">
              <img
                src="/resources/images/content/node_access_form.png"
                height="200"
                alt="Node access Form"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ dispatch, nodeAccess }) => ({
  dispatch,
  nodeAccess,
})

export default connect(mapStateToProps)(NodeAccessForm)
