import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import style from './style.module.scss'

const KeyFile = ({ keyFileAccess, setKeyFileAccess, onButtonClick, dispatch }) => {
  const [fileList, setFileList] = useState(null)

  const props = {
    onRemove: () => {
      setFileList(null)
    },
    beforeUpload: (file) => {
      setFileList([file])
      return false
    },
    fileList,
  }

  const onVerify = (values) => {
    dispatch({
      type: 'nodeAccess/SET_STATE',
      payload: {
        keyFile: values.keyFile,
      },
    })
    onButtonClick('passphrase')
  }

  return (
    <div className="row">
      <div className="d-none d-sm-none d-md-block col-md-6 col-lg-6 col-xl-6">
        <div className={`${style.background_white}  pb-5 pt-5`}>
          <div className="row">
            <div className="col-12">
              <img src="/resources/images/content/node_access.png" height="400" alt="Node access" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 pr-5">
        <div className={`${style.background_white}`}>
          <div className="row">
            <div className="col-12 mb-5">
              <h1 className={`${style.heading}`}>Node Access</h1>
            </div>

            <div className="col-12 mt-3 mb-5">
              {!keyFileAccess && (
                <h1 className={`${style.content_question}`}>
                  Do control machine have access to all the servers using{' '}
                  <span className={`${style.highlight_text}`}>Key file </span>?
                </h1>
              )}
              {keyFileAccess && (
                <div className="row">
                  <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{}}
                    onFinish={onVerify}
                    autoComplete="off"
                  >
                    <div className="col-12">
                      <Form.Item
                        name="keyFile"
                        label={<div className={`mb-3 ${style.label}`}>Key File:</div>}
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
                        <Upload {...props} maxCount={1}>
                          <Button
                            size="large"
                            icon={<UploadOutlined />}
                            className={style.upload_button}
                          >
                            Upload Key File
                          </Button>
                        </Upload>
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 mt-5">
                          <Button htmlType="submit" size="large" className={`${style.yes_button}`}>
                            Next
                          </Button>
                          <Button
                            onClick={() => setKeyFileAccess(false)}
                            size="large"
                            className={`ml-3 ${style.no_button}`}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              )}
            </div>
            {!keyFileAccess && (
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <Button
                      onClick={() => setKeyFileAccess(true)}
                      size="large"
                      className={`${style.yes_button}`}
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={() => onButtonClick('username')}
                      size="large"
                      className={`ml-3 ${style.no_button}`}
                    >
                      No
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ dispatch }) => ({
  dispatch,
})
export default connect(mapStateToProps)(KeyFile)
