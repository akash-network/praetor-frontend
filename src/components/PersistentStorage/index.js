import React, { useState } from 'react'
import { connect } from 'react-redux'
import DriveSetup from './drive-setup'
import EnablePersistentStorage from './enable-persistent-storage'

const PersistentStorage = ({ dispatch }) => {
  const [persistentStorageStep, setPersistentStorageStepStep] = useState('enableStorage')

  const enablePersistentStorage = (flag) => {
    if (flag) {
      setPersistentStorageStepStep('driveSetup')
    } else {
      dispatch({
        type: 'user/SET_STATE',
        payload: {
          akashStep: 'akashWalletImport',
        },
      })
    }
  }

  return (
    <div className="container-full">
      {persistentStorageStep === 'enableStorage' && (
        <EnablePersistentStorage
          onEnablePersistentStorage={(flag) => enablePersistentStorage(flag)}
        />
      )}
      {persistentStorageStep === 'driveSetup' && <DriveSetup />}
    </div>
  )
}

const mapStateToProps = ({ dispatch }) => ({
  dispatch,
})
export default connect(mapStateToProps)(PersistentStorage)
