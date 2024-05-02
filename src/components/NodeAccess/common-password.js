import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import style from './style.module.scss'

const CommonPassword = ({
  samePassword,
  setSamePassword,
  onButtonClick,
  dispatch,
  onBackButtonClick,
}) => {
  const onVerify = (values) => {
    dispatch({
      type: 'nodeAccess/SET_STATE',
      payload: {
        commonPassword: values.commonPassword,
      },
    })
    onButtonClick('form')
  }

  return (
    <div className="row">
      <div className="d-none d-sm-none d-md-block col-md-6 col-lg-6 col-xl-6">
        <div className={`${style.background_white}`}>
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
              {!samePassword && (
                <h1 className={`${style.content_question}`}>
                  Does all the servers have same{' '}
                  <span className={`${style.highlight_text}`}>password </span>?
                </h1>
              )}
              {samePassword && (
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
                        name="commonPassword"
                        label={<div className={style.label}>Common Password</div>}
                        rules={[{ required: true, message: 'Common password is required' }]}
                      >
                        <Input.Password
                          placeholder="Input your common password"
                          className={style.input}
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 mt-5">
                          <Button htmlType="submit" size="large" className={`${style.yes_button}`}>
                            Next
                          </Button>
                          <Button
                            onClick={() => setSamePassword(false)}
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
            {!samePassword && (
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <Button
                      onClick={() => setSamePassword(true)}
                      size="large"
                      className={`${style.yes_button}`}
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={() => onButtonClick('form')}
                      size="large"
                      className={`ml-3 ${style.no_button}`}
                    >
                      No
                    </Button>
                    <Button
                      className="ml-1"
                      type="link"
                      onClick={() => onBackButtonClick('keyFileAccess')}
                    >
                      Back
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
export default connect(mapStateToProps)(CommonPassword)
