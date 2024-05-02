import React, { useEffect, useState } from 'react'

import { connect } from 'react-redux'
import { Form, Drawer, Input, Radio, Upload, Button } from 'antd'
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'

import style from './style.module.scss'

const UpdateSession = ({ showDrawer, closeSessionDrawer, dispatch, resources }) => {
  const [size, setSize] = useState()
  const [form] = Form.useForm()
  const [sshMode, setSSHMode] = useState('password')
  const [keyFile, setKeyFile] = useState(null)

  useEffect(() => {
    setSize('large')
  }, [])

  useEffect(() => {
    if (showDrawer) {
      form.resetFields()
    }
  }, [showDrawer, form])

  useEffect(() => {
    if (resources.sessionUpdated) {
      closeSessionDrawer(true)
    }
  }, [resources.sessionUpdated, closeSessionDrawer])

  const closeDrawer = () => {
    closeSessionDrawer(false)
  }
  const onFinish = (values) => {
    values.sshMode = sshMode
    dispatch({
      type: 'resources/UPDATE_SESSION',
      payload: {
        values,
      },
    })
  }
  const changeSSHMode = (event) => {
    setSSHMode(event.target.value)
  }

  const keyProps = {
    onRemove: () => {
      setKeyFile(null)
    },
    beforeUpload: (file) => {
      setKeyFile([file])
      return false
    },
    keyFile,
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
              <h1 className={style.h1}>Control Machine Access</h1>
              <span className="mt-2">
                To change certain functionalities from dashboard, we require Control Machine Access
              </span>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12">
              <Form
                name="dynamic_form_nest_item"
                onFinish={onFinish}
                layout="vertical"
                autoComplete="off"
                form={form}
              >
                <div className="row">
                  <div className="col-sm-12 col-md-8 col-lg-8 col-xl-6">
                    <Form.Item
                      name="hostname"
                      label={<div className={style.label}>Host Name</div>}
                      rules={[{ required: true, message: 'Host name is required' }]}
                      tooltip={{
                        title: 'Host name or IP address of your server',
                        placement: 'right',
                        overlayStyle: { maxWidth: 340 },
                        icon: <InfoCircleOutlined style={{ color: '#efefef' }} />,
                      }}
                    >
                      <Input placeholder="Input your hostname in here" className={style.input} />
                    </Form.Item>
                  </div>
                  <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                    <Form.Item
                      name="port"
                      label={<div className={style.label}>Port</div>}
                      rules={[{ required: true }]}
                      initialValue="22"
                    >
                      <Input placeholder="port-default 22" className={`${style.input}`} />
                    </Form.Item>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-12 col-xl-9">
                    <Form.Item
                      name="username"
                      label={<div className={style.label}>Username</div>}
                      rules={[{ required: true, message: 'Username is required' }]}
                      tooltip={{
                        title: 'User must have sudo rights',
                        placement: 'right',
                        overlayStyle: { maxWidth: 340 },
                        icon: <InfoCircleOutlined style={{ color: '#efefef' }} />,
                      }}
                    >
                      <Input placeholder="Input your username" className={style.input} />
                    </Form.Item>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-xl-12 mb-4 mt-3 custom_radio_1">
                    <Radio.Group defaultValue="password" size="large" onChange={changeSSHMode}>
                      <Radio.Button value="password">Password</Radio.Button>
                      <Radio.Button value="file">File</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                <div className="row">
                  {sshMode === 'password' && (
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-9">
                      <Form.Item
                        name="password"
                        label={<div className={style.label}>Password</div>}
                        rules={[{ required: true, message: 'password is required' }]}
                      >
                        <Input.Password
                          placeholder="Input your password"
                          className={style.input}
                          iconRender={(iconVisible) =>
                            iconVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Form.Item>
                    </div>
                  )}
                </div>
                {sshMode === 'file' && (
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-9">
                      <div className="row">
                        <div className="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-5 col-xl-4">
                          <Form.Item
                            name="keyFile"
                            label={<div className={style.label}>Key file</div>}
                            rules={[
                              () => ({
                                required: true,
                                validator(_, value) {
                                  if (value && value.file.name) {
                                    return Promise.resolve()
                                  }
                                  return Promise.reject(new Error('Key file is required.'))
                                },
                              }),
                            ]}
                          >
                            <Upload {...keyProps} maxCount={1}>
                              <Button
                                size="large"
                                icon={<UploadOutlined />}
                                className={style.upload_button}
                              >
                                Select File
                              </Button>
                            </Upload>
                          </Form.Item>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <Form.Item
                            name="passphrase"
                            label={<div className={style.label}>Passphrase</div>}
                          >
                            <Input.Password
                              placeholder="Input your passphrase"
                              className={style.input}
                              iconRender={(iconVisible) =>
                                iconVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                              }
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="row mt-3">
                  <div className="col-12">
                    <Button
                      htmlType="submit"
                      size="large"
                      className={`${style.connect_button}`}
                      loading={resources.sessionLoading}
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

export default connect(mapStateToProps)(UpdateSession)
