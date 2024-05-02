import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import Calculator from 'components/Calculator'

const ProviderCalculator = () => {
  return (
    <div>
      <Helmet title="Provider Calculator" />
      <Calculator />
    </div>
  )
}

const mapStateToProps = ({ user }) => ({
  user,
})

export default connect(mapStateToProps)(ProviderCalculator)
