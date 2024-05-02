import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input } from 'antd'
import style from './style.module.scss'

const Passphrase = ({ passphraseProtect, setPassphraseProtect, onButtonClick, dispatch }) => {
  const onVerify = (values) => {
    dispatch({
      type: 'nodeAccess/SET_STATE',
      payload: {
        passphrase: values.passphrase,
      },
    })
    onButtonClick('username')
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
              {!passphraseProtect && (
                <h1 className={`${style.content_question}`}>
                  Is your key <span className={`${style.highlight_text}`}>passphrase </span>
                  protected ?
                </h1>
              )}
              {passphraseProtect && (
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
                        name="passphrase"
                        label={<div className={style.label}>Passphrase</div>}
                        rules={[{ required: true, message: 'Passphrase is required' }]}
                      >
                        <Input.Password
                          placeholder="Input your Passphrase"
                          className={style.input}
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
                            onClick={() => setPassphraseProtect(false)}
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
            {!passphraseProtect && (
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <Button
                      onClick={() => setPassphraseProtect(true)}
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
export default connect(mapStateToProps)(Passphrase)
