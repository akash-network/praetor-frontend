// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import style from './style.module.scss'

const ExtraLayout = ({ user, children }) => {
  const getWidth = () => {
    const { outerWidth: width } = window
    return width
  }

  const [width, setWidth] = useState(getWidth())
  useEffect(() => {
    function handleResize() {
      setWidth(getWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const redBackgroundScreens = ['walletConnect', 'congratulations']
  const mobileRedBackgroundScreen = ['walletConnect', 'masterNodeAccess', 'congratulations']

  const isBackgroundRed = () => {
    let backgroundRed = false
    if (width < 768 && mobileRedBackgroundScreen.includes(user.akashStep)) {
      backgroundRed = true
      // mobile
      // check if background is red or white
    } else if (width > 768 && redBackgroundScreens.includes(user.akashStep)) {
      // desktop
      // check if background is red or white
      backgroundRed = true
    }
    return backgroundRed
  }

  return (
    <div>
      {children}
      {window.location.pathname !== '/processing-error' && (
        <div
          className={
            isBackgroundRed()
              ? `container-full pr-3 ${style.footer_red}`
              : `container-full pr-3 ${style.footer_white}`
          }
        />
      )}
    </div>
  )
}

const mapStateToProps = ({ user, dispatch, settings }) => ({ user, dispatch, settings })

export default withRouter(connect(mapStateToProps)(ExtraLayout))
