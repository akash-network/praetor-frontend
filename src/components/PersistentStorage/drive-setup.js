import { Button, Table } from 'antd'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import style from './style.module.scss'

const DriveSetup = ({ dispatch, persistentStorage }) => {
  const [driveType, setDriveType] = useState(null)
  const [differentDrives, setDifferentDrives] = useState(false)
  const [selectedDrives, setSelectedDrives] = useState([])
  const [selectedDriveKeys, setSelectedDriveKeys] = useState([])
  const columns = [
    {
      title: 'Name',
      dataIndex: 'drive_name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Size',
      dataIndex: 'size',
    },
    {
      title: 'Type',
      dataIndex: 'storage_type',
    },
    {
      title: 'Node',
      dataIndex: 'node_name',
    },
  ]

  useEffect(() => {
    const different =
      _.filter(persistentStorage.drives, (o) => {
        return o.storage_type === 'nvme'
      }).length !== persistentStorage.drives.length
    setDifferentDrives(different)

    const selectedKeys = []

    if (!different) {
      persistentStorage.drives.forEach((entry) => {
        selectedKeys.push(`${entry.drive_name}${entry.node_name}`)
      })

      setSelectedDriveKeys(selectedKeys)
      setSelectedDrives(persistentStorage.drives)
    }
  }, [persistentStorage])

  const setDrives = () => {
    dispatch({
      type: 'persistentStorage/SET_DRIVES',
      payload: {
        drives: selectedDrives,
      },
    })
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedDrives(selectedRows)
      setSelectedDriveKeys(selectedRowKeys)
      if (selectedRowKeys.length) {
        setDriveType(selectedRows[0].storage_type)
      } else {
        setDriveType(null)
      }
    },
    getCheckboxProps: (record) => ({
      disabled: driveType && driveType !== record.storage_type,
      name: record.drive_name,
    }),
    onSelectNone: () => {
      setDriveType(null)
    },
  }

  return (
    <div className="row">
      <div className="d-none d-sm-none d-md-block col-md-6 col-lg-6 col-xl-6">
        <div className={`${style.background_white}  pb-5 pt-5`}>
          <div className="row">
            <div className="col-12">
              <img
                src="/resources/images/content/persistent-storage.png"
                height="400"
                alt="Persistent Storage"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 pr-5">
        <div className={`${style.background_white}`}>
          <div className="container">
            <div className="row">
              <div className="col-12 mb-4">
                <h1 className={`${style.heading}`}>Select Drives</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3 mb-5">
                <div>
                  <div className={`${style.content_question}`}>
                    Enable persistent storage on selected drives.
                  </div>
                  {differentDrives && (
                    <div>Note: Only one type of drive (e.g. ssd) will be allowed.</div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Table
                  rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                    hideSelectAll: differentDrives,
                    selectedRowKeys: selectedDriveKeys,
                  }}
                  rowKey={(record) => `${record.drive_name}${record.node_name}`}
                  columns={columns}
                  dataSource={persistentStorage.drives}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Button
                  onClick={() => setDrives()}
                  size="large"
                  className={`${style.yes_button}`}
                  loading={persistentStorage.loading}
                >
                  Next
                </Button>
                <Button size="large" className="ml-3" type="link">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ dispatch, persistentStorage }) => ({
  dispatch,
  persistentStorage,
})
export default connect(mapStateToProps)(DriveSetup)
