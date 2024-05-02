import React from 'react'
import WalletConnect from 'components/WalletConnect'
import { Helmet } from 'react-helmet'

const Login = () => {
  return (
    <div>
      <Helmet title="On-Boarding" />
      <WalletConnect />
    </div>
  )
}

export default Login
