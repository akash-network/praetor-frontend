import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Divider } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { CopyBlock, dracula } from 'react-code-blocks'
import TextArea from 'antd/lib/input/TextArea'
import style from './style.module.scss'

const AkashWalletImport = ({ dispatch, walletImport, controlMachine }) => {
  const [form] = Form.useForm()
  const [importMode, setImportMode] = useState(null)
  const onVerify = (values) => {
    values.seedOverride = false
    dispatch({
      type: 'walletImport/PRAETOR_IMPORT_WALLET',
      payload: values,
    })
  }
  const onClickManualVerify = () => {
    dispatch({
      type: 'walletImport/MANUAL_IMPORT_WALLET',
    })
  }

  useEffect(() => {
    if (walletImport.changeSeedPhrase) {
      form.setFieldsValue({
        seedPhrase: '',
      })
    }
  }, [form, walletImport.changeSeedPhrase])

  return (
    <div className={`container ${style.background_white}`}>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-5 col-lg-6 col-xl-5">
          <div className="mt-5">
            <img
              src="/resources/images/content/import_akash_wallet.png"
              height="300"
              alt="Akash Wallet Import"
              className={`${style.wallet_import_logo}`}
            />
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-7 col-lg-6 col-xl-7">
          <div className="container margin-adjust">
            <div className="row mb-5">
              <div className="col-12">
                <h2 className={style.h1}>
                  Import <img src="/resources/images/logo/akash.svg" width={210} alt="akash logo" />
                  &nbsp;wallet
                </h2>
              </div>
            </div>
            {!importMode && (
              <div className={`row ${style.mode_select}`}>
                <div className="col-5 mr-3">
                  <h2 className={style.praetor_title}>Praetor</h2>
                  <div className="row">
                    <div className="col-12 mt-5">
                      Praetor will auto import using secure end-to-end encryption.
                      <br />
                      Seed phrase is required.
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 mt-5">
                      <Button
                        htmlType="submit"
                        size="large"
                        className={`${style.auto_next_button}`}
                        onClick={() => setImportMode('auto')}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
                <Divider
                  type="vertical"
                  style={{ height: '19em', borderRight: '2px solid #ff7043' }}
                />
                <div className="col-6">
                  <h2 className={style.manual_title}>Manual</h2>
                  <div className="row">
                    <div className="col-12 mt-5">
                      You need to login to control machine and follow the instruction to import
                      wallet.
                      <br />
                      Seed phrase is not required.
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 mt-5">
                      <Button
                        htmlType="submit"
                        size="large"
                        className={`${style.manual_next_button}`}
                        onClick={() => setImportMode('manual')}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {importMode === 'auto' && (
              <Form
                requiredMark="optional"
                className="white_background"
                name="basic"
                layout="vertical"
                initialValues={{}}
                onFinish={onVerify}
                form={form}
                autoComplete="off"
              >
                <div className="row">
                  <div className="col-12">
                    <h2 className={`mb-4 ${style.praetor_title}`}>Praetor Mode</h2>
                    <Form.Item
                      name="seedPhrase"
                      label={<div className={style.lable}>Seed Phrase</div>}
                      rules={[
                        { required: true, message: 'Seed Phrase is required' },
                        () => ({
                          validator(_, value) {
                            if (
                              value &&
                              (value.split(' ').length === 12 || value.split(' ').length === 24)
                            )
                              return Promise.resolve()
                            return Promise.reject(
                              new Error('Seed phrase must be 12 words or 24 words'),
                            )
                          },
                        }),
                      ]}
                    >
                      <TextArea
                        placeholder="Input your akash wallet seed phrase over here"
                        className={style.input}
                        type="password"
                        style={{ textAlign: 'center' }}
                        rows={4}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="password"
                      label={<div className={style.lable}>Password</div>}
                      rules={[
                        { required: true, message: 'password is required' },
                        { min: 8, message: 'Minimum length of password must be 8' },
                      ]}
                    >
                      <Input.Password
                        placeholder="Input your password over here"
                        className={style.input}
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12 blank-button">
                    <Button
                      htmlType="submit"
                      size="large"
                      className={`${style.connect_button}`}
                      loading={walletImport.loading}
                    >
                      Verify
                    </Button>
                    <Button
                      type="text"
                      size="large"
                      className={`${style.switch_to_button} ml-2`}
                      onClick={() => setImportMode('manual')}
                    >
                      Switch to Manual Mode
                    </Button>
                  </div>
                </div>
              </Form>
            )}

            {importMode === 'manual' && (
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <h2 className={`mb-4 ${style.manual_title}`}>Manual Mode</h2>
                    <div className={`${style.steps} mb-3`}>
                      Step1: Login to the control machine using username &ldquo;
                      {controlMachine.username}&rdquo;
                    </div>
                    <div className={`${style.steps} mb-2`}>Step2: Create Keyring file</div>
                    <div className={`${style.steps} mb-3`}>
                      <CopyBlock
                        text="~/bin/provider-services --keyring-backend file keys add wallet_name --recover"
                        theme={dracula}
                        language="shell"
                        codeBlock
                        showLineNumbers={false}
                      />
                    </div>
                    <div className={`${style.steps} mb-3`}>
                      Step3: Enter your mnemonic seed phrase and passphrase
                    </div>
                    <div className={`${style.steps} mb-3`}>
                      Step4: Enter the same passphrase you have used in Step 3
                    </div>
                    <div className={`${style.steps} mb-5`}>
                      <CopyBlock
                        text="echo {passphrase} > ~/.praetor/wallet_phrase_password.txt"
                        theme={dracula}
                        language="shell"
                        codeBlock
                        showLineNumbers={false}
                      />
                    </div>
                    <div className={`${style.steps}`}>
                      Click Verify after finishing all the above steps.
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-12 blank-button">
                    <Button
                      htmlType="submit"
                      size="large"
                      className={`${style.auto_next_button}`}
                      onClick={() => onClickManualVerify()}
                    >
                      Verify
                    </Button>
                    <Button
                      type="text"
                      size="large"
                      className={`${style.switch_to_button} ml-2`}
                      onClick={() => setImportMode('auto')}
                    >
                      Switch to Praetor Mode
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

const mapStateToProps = ({ dispatch, walletImport, controlMachine }) => ({
  dispatch,
  walletImport,
  controlMachine,
})
export default connect(mapStateToProps)(AkashWalletImport)
