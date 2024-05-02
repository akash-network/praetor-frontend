import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form, Drawer, Button, DatePicker, Divider } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import moment from 'moment'
import Swal from 'sweetalert2'
import style from './style.module.scss'

const { RangePicker } = DatePicker

const UpdateProviderNote = ({ showDrawer, onCloseDrawer, dispatch, resources }) => {
  const [form] = Form.useForm()
  const [size, setSize] = useState()

  useEffect(() => {
    setSize('large')
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

  const closeDrawer = () => {
    onCloseDrawer()
  }

  const onFinish = (values) => {
    const { timeFrame, providerNote } = values

    dispatch({
      type: 'resources/SET_PROVIDER_NOTES',
      payload: {
        message: providerNote,
        startTime: timeFrame[0],
        endTime: timeFrame[1],
      },
    })
  }

  const deleteMessage = () => {
    Swal.fire({
      title: 'Delete Provider Message',
      text: 'Are you sure you want to delete Provider Message?',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#ff7043',
      denyButtonColor: '#c2c2c2',
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({
          type: 'resources/DELETE_PROVIDER_NOTE',
        })
      }
    })
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
              <h1 className={style.h1}>Edit Provider Message</h1>
              <span className="mt-2">
                Provider Message will be displayed on status page for selected timeframe.
                <br />
                You can provide detailed note here e.g Downtime, upgrades, new features, promotions
                etc.
              </span>
            </div>
          </div>
          <Divider />
          <div className="row mt-2">
            <div className="col-12">
              <Form
                requiredMark="optional"
                className="white_background"
                name="basic"
                layout="vertical"
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{
                  providerNote: resources.providerNote?.message
                    ? resources.providerNote?.message
                    : '',
                  timeFrame: [
                    resources.providerNote?.startTime
                      ? moment.unix(resources.providerNote?.startTime)
                      : '',
                    resources.providerNote?.endTime
                      ? moment.unix(resources.providerNote?.endTime)
                      : '',
                  ],
                }}
              >
                <div className="row mt-4">
                  <div className="col-9">
                    <Form.Item
                      name="providerNote"
                      label={<div className={style.label}>Provider Message </div>}
                      rules={[{ required: true, message: 'Provider Message is required!' }]}
                    >
                      <TextArea
                        className={style.input}
                        rows={4}
                        size="large"
                        maxLength={500}
                        placeholder="Provide detailed note here."
                        style={{ textAlign: 'left' }}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <Form.Item
                      name="timeFrame"
                      label={<div className={style.label}>Select Date</div>}
                      rules={[{ required: true, message: 'Time is required!' }]}
                    >
                      <RangePicker
                        className={`${style.input}`}
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        value={[resources.providerNote?.startTime, resources.providerNote?.endTime]}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-12">
                    <Button
                      htmlType="submit"
                      size="large"
                      loading={resources.processLoading}
                      className={`${style.connect_button}`}
                    >
                      Submit
                    </Button>
                    {resources.providerNote?.message && (
                      <Button type="link" className="ml-3" onClick={deleteMessage}>
                        Delete Message
                      </Button>
                    )}
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
export default connect(mapStateToProps)(UpdateProviderNote)
