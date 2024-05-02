import React, { useState } from 'react'
import { connect } from 'react-redux'
import KeyFile from './keyfile'
import Passphrase from './passphrase'
import CommonUsername from './common-username'
import CommonPassword from './common-password'
import NodeAccessForm from './form'

const NodeAccess = ({ dispatch }) => {
  const [nodeAccessStep, setNodeAccessStep] = useState('keyFileAccess')
  const [keyFileAccess, setKeyFileAccess] = useState(false)
  const [passphraseProtect, setPassphraseProtect] = useState(false)
  const [sameUsername, setSameUsername] = useState(false)
  const [samePassword, setSamePassword] = useState(false)

  const onBackButtonClick = (step) => {
    if (step === 'password') {
      dispatch({
        type: 'nodeAccess/SET_STATE',
        payload: {
          commonPassword: null,
        },
      })
      setSamePassword(false)
      setNodeAccessStep(step)
    } else if (step === 'username') {
      dispatch({
        type: 'nodeAccess/SET_STATE',
        payload: {
          commonUsername: null,
        },
      })
      setSameUsername(false)
      setNodeAccessStep(step)
    } else if (step === 'keyFileAccess') {
      dispatch({
        type: 'nodeAccess/SET_STATE',
        payload: {
          keyFile: null,
          passphrase: null,
        },
      })
      setKeyFileAccess(false)
      setNodeAccessStep(step)
    }
  }

  return (
    <div className="container-full">
      {nodeAccessStep === 'keyFileAccess' && (
        <KeyFile
          keyFileAccess={keyFileAccess}
          setKeyFileAccess={(flag) => setKeyFileAccess(flag)}
          onButtonClick={(step) => setNodeAccessStep(step)}
        />
      )}
      {nodeAccessStep === 'passphrase' && (
        <Passphrase
          passphraseProtect={passphraseProtect}
          setPassphraseProtect={(flag) => setPassphraseProtect(flag)}
          onButtonClick={(step) => setNodeAccessStep(step)}
        />
      )}
      {nodeAccessStep === 'username' && (
        <CommonUsername
          sameUsername={sameUsername}
          keyFileAccess={keyFileAccess}
          setSameUsername={(flag) => setSameUsername(flag)}
          onButtonClick={(step) => setNodeAccessStep(step)}
          onBackButtonClick={(step) => onBackButtonClick(step)}
        />
      )}
      {nodeAccessStep === 'password' && (
        <CommonPassword
          samePassword={samePassword}
          setSamePassword={(flag) => setSamePassword(flag)}
          onButtonClick={(step) => setNodeAccessStep(step)}
          onBackButtonClick={(step) => onBackButtonClick(step)}
        />
      )}
      {nodeAccessStep === 'form' && (
        <NodeAccessForm
          keyFileAccess={keyFileAccess}
          samePassword={samePassword}
          sameUsername={sameUsername}
          onBackButtonClick={(step) => onBackButtonClick(step)}
        />
      )}
    </div>
  )
}

const mapStateToProps = ({ dispatch }) => ({
  dispatch,
})
export default connect(mapStateToProps)(NodeAccess)
