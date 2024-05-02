import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Upload, Divider, Radio, Checkbox, Select } from 'antd'
import Swal from 'sweetalert2'
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import style from './style.module.scss'

const ControlMachine = ({ dispatch, controlMachine, user }) => {
  const [sshMode, setSSHMode] = React.useState('password')
  const [gpuSelected, setGPUSelected] = useState(false)
  const [gpuVendor, setGPUVendor] = useState('nvidia')
  const onVerify = (values) => {
    if (typeof values.controlMachineIncluded === 'undefined') {
      values.controlMachineIncluded = false
    }
    values.installAkash = false
    values.sshMode = sshMode

    if (!user.kubeBuild.status) {
      Swal.fire({
        title: 'Is your Kubernetes Akash Ready?',
        text: 'Does your Kubernetes have Akash related services?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonColor: '#ff7043',
        denyButtonColor: '#c2c2c2',
        confirmButtonText: 'No',
        denyButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          values.installAkash = true
          dispatch({
            type: 'controlMachine/CHECK_ACCESS',
            payload: values,
          })
        } else if (result.isDenied) {
          dispatch({
            type: 'controlMachine/CHECK_ACCESS',
            payload: values,
          })
        } else {
          dispatch({
            type: 'controlMachine/SET_STATE',
            payload: {
              loading: false,
            },
          })
        }
      })
    } else {
      dispatch({
        type: 'controlMachine/CHECK_ACCESS',
        payload: values,
      })
    }
  }

  const [kubeFile, setKubeFile] = React.useState(null)

  const [keyFile, setKeyFile] = React.useState(null)

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

  const kubeProps = {
    onRemove: () => {
      setKubeFile(null)
    },
    beforeUpload: (file) => {
      setKubeFile([file])
      return false
    },
    kubeFile,
  }

  const changeSSHMode = (event) => {
    setSSHMode(event.target.value)
  }

  return (
    <div className="container-full">
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-7">
          <div className={`${style.background_red}`}>
            <div className="container margin-adjust pt-5 pb-5">
              <div className="row">
                <div className="col-12">
                  {user.kubeBuild.status ? (
                    <div>
                      <h1 className={style.h1}>Server Access</h1>
                      <span className={style.subtext}>
                        In order to become provider, you have to connect your server.
                        <br />
                        Please open ssh connection to public and open port 22 (default)
                      </span>
                    </div>
                  ) : (
                    <div>
                      <h1 className={style.h1}>Control Machine Access</h1>
                      <span className={style.subtext}>
                        In order to become provider, you have to connect your control machine
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Form
                requiredMark="optional"
                className={`mt-5 red_background ${style.tooltip}`}
                name="basic"
                layout="vertical"
                initialValues={{ gpu: gpuSelected }}
                onFinish={onVerify}
                autoComplete="off"
              >
                <div className="row">
                  <div className="col-sm-12 col-md-8 col-lg-9 col-xl-6">
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
                  <div className="col-sm-12 col-md-4 col-lg-3 col-xl-2">
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
                  <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6">
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
                  <div className="col-12 col-xl-12 mb-4 mt-3 custom_radio">
                    <Radio.Group defaultValue="password" size="large" onChange={changeSSHMode}>
                      <Radio.Button value="password">Password</Radio.Button>
                      <Radio.Button value="file">File</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                <div className="row">
                  {sshMode === 'password' && (
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6">
                      <Form.Item
                        name="password"
                        label={<div className={style.label}>Password</div>}
                        rules={[{ required: true, message: 'password is required' }]}
                      >
                        <Input.Password
                          placeholder="Input your password"
                          className={style.input}
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Form.Item>
                    </div>
                  )}
                </div>
                {sshMode === 'file' && (
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6">
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
                              iconRender={(visible) =>
                                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                              }
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!user.kubeBuild.status && (
                  <div>
                    <Divider />
                    <div className="row">
                      <div className="col-12">
                        <Form.Item
                          name="uploadFile"
                          label={<div className={style.label}>Kube Config File</div>}
                          rules={[
                            () => ({
                              required: true,
                              validator(_, value) {
                                if (value && value.file.name) {
                                  return Promise.resolve()
                                }
                                return Promise.reject(new Error('kube config file is required.'))
                              },
                            }),
                          ]}
                        >
                          <Upload {...kubeProps} maxCount={1} className={style.input}>
                            <Button icon={<UploadOutlined />} className={style.upload_button}>
                              Select File
                            </Button>
                          </Upload>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                )}
                {user.kubeBuild.type === 'k8s' && (
                  <div className="row">
                    <div className="col-12 mb-3 custom-checkbox">
                      <Form.Item name="controlMachineIncluded" valuePropName="checked">
                        <Checkbox defaultChecked={false}>
                          <div className={style.label}>
                            Do you want this machine to be in Kuberenetes Cluster?
                          </div>
                        </Checkbox>
                      </Form.Item>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
                    <Form.Item
                      name="gpu"
                      label={<div className={style.label}>Do you have GPU?</div>}
                      rules={[{ required: true, message: 'GPU selection is requried!' }]}
                    >
                      <Select
                        className="customSelect"
                        dropdownClassName={`${style.select}`}
                        onChange={(value) => setGPUSelected(value)}
                        options={[
                          {
                            value: true,
                            label: 'Yes',
                          },
                          {
                            value: false,
                            label: 'No',
                          },
                        ]}
                      />
                    </Form.Item>
                  </div>
                  {gpuSelected && (
                    <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
                      <Form.Item
                        name="gpuType"
                        label={<div className={style.label}>GPU Type</div>}
                        rules={[{ required: true }]}
                        onChange={(value) => setGPUVendor(value)}
                        initialValue="nvidia"
                      >
                        <Select
                          className="customSelect"
                          dropdownClassName={`${style.select}`}
                          options={[
                            {
                              value: 'nvidia',
                              label: 'Nvidia',
                            },
                            {
                              value: 'other',
                              label: 'Other',
                            },
                          ]}
                        />
                      </Form.Item>
                    </div>
                  )}
                  {gpuSelected && gpuVendor === 'nvidia' && (
                    <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
                      <Form.Item
                        name="gpuModel"
                        label={<div className={style.label}>GPU Model</div>}
                        rules={[{ required: true }]}
                        initialValue="h100"
                      >
                        <Select
                          className="customSelect"
                          dropdownClassName={`${style.select}`}
                          options={[
                            {
                              value: 'h100',
                              label: 'H100',
                            },
                            {
                              value: 'a100',
                              label: 'A100',
                            },
                            {
                              value: 'v100',
                              label: 'V100',
                            },
                            {
                              value: 'p100',
                              label: 'P100',
                            },
                            {
                              value: 'a40',
                              label: 'A40',
                            },
                            {
                              value: 'a10',
                              label: 'A10',
                            },
                            {
                              value: 'p4',
                              label: 'P4',
                            },
                            {
                              value: 'k80',
                              label: 'K80',
                            },
                            {
                              value: 't4',
                              label: 'T4',
                            },
                            {
                              value: '4090',
                              label: '4090',
                            },
                            {
                              value: '3090ti',
                              label: '3090Ti',
                            },
                            {
                              value: '4080',
                              label: '4080',
                            },
                            {
                              value: '3090',
                              label: '3090',
                            },
                            {
                              value: '3080ti',
                              label: '3080Ti',
                            },
                            {
                              value: '3080',
                              label: '3080',
                            },
                            {
                              value: '3060ti',
                              label: '3060Ti',
                            },
                            {
                              value: 'other',
                              label: 'Other',
                            },
                          ]}
                        />
                      </Form.Item>
                    </div>
                  )}
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    {user.kubeBuild.status ? (
                      <Button
                        htmlType="submit"
                        size="large"
                        className={`${style.connect_button}`}
                        loading={controlMachine.loading}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        htmlType="submit"
                        size="large"
                        className={`${style.connect_button}`}
                        loading={controlMachine.loading}
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <div className="d-none d-sm-none d-md-block col-md-6 col-lg-6 col-xl-5">
          <div className={`${style.background_white}`}>
            <div className="margin-adjust pt-5 pb-5">
              {user.kubeBuild.status ? (
                <img
                  src="/resources/images/content/server_access.png"
                  height="400"
                  alt="Server access"
                />
              ) : (
                <img
                  src="/resources/images/content/masternode.png"
                  height="300"
                  alt="Master node access"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ dispatch, controlMachine, user, chain }) => ({
  dispatch,
  controlMachine,
  user,
  chain,
})
export default connect(mapStateToProps)(ControlMachine)
