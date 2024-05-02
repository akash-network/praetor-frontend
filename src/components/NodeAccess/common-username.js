import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input } from 'antd'
import style from './style.module.scss'

const CommonUsername = ({
  sameUsername,
  keyFileAccess,
  setSameUsername,
  onButtonClick,
  dispatch,
  onBackButtonClick,
}) => {
  const onVerify = (values) => {
    dispatch({
      type: 'nodeAccess/SET_STATE',
      payload: {
        commonUsername: values.commonUsername,
      },
    })
    if (keyFileAccess) {
      onButtonClick('form')
    } else {
      onButtonClick('password')
    }
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
              {!sameUsername && (
                <h1 className={`${style.content_question}`}>
                  Does all the servers have same{' '}
                  <span className={`${style.highlight_text}`}>username </span>?
                </h1>
              )}
              {sameUsername && (
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
                        name="commonUsername"
                        label={<div className={style.label}>Common Username</div>}
                        rules={[{ required: true, message: 'Common Username is required' }]}
                      >
                        <Input placeholder="Input your common username" className={style.input} />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 mt-5">
                          <Button htmlType="submit" size="large" className={`${style.yes_button}`}>
                            Next
                          </Button>
                          <Button
                            onClick={() => setSameUsername(false)}
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
            {!sameUsername && (
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <Button
                      onClick={() => setSameUsername(true)}
                      size="large"
                      className={`${style.yes_button}`}
                    >
                      Yes
                    </Button>
                    {keyFileAccess && (
                      <Button
                        onClick={() => onButtonClick('form')}
                        size="large"
                        className={`ml-3 ${style.no_button}`}
                      >
                        No
                      </Button>
                    )}
                    {!keyFileAccess && (
                      <Button
                        onClick={() => onButtonClick('password')}
                        size="large"
                        className={`ml-3 ${style.no_button}`}
                      >
                        No
                      </Button>
                    )}
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
export default connect(mapStateToProps)(CommonUsername)
