import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import style from './style.module.scss'

const mapStateToProps = ({ settings }) => ({ settings })

const Footer = ({ settings: { isContentMaxWidth, logo } }) => {
  return (
    <div
      className={classNames(style.footer, {
        [style.footerFullWidth]: !isContentMaxWidth,
      })}
    >
      <div className={style.inner}>
        <div className="row">
          <div className="col-md-8">
            <p>
              <strong>Praetor Provider Platform for Akash</strong>
            </p>
            <p>
              Warning! Praetor Provider is in beta version. Please use a new wallet and a small AKT
              balance until we stabilize Praetor Provider. We are not responsible for any loss or
              damages caused due to this app.
            </p>
            <a
              href="https://praetorapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className={style.logo}
            >
              <img src="/resources/images/logo/red_logo.png" width={25} alt="Praetor Logo" />
              <strong className="ml-2">{logo}</strong>
            </a>
            <br />
            <p className="mb-0">
              Copyright © {new Date().getFullYear()}{' '}
              <a href="https://praetorapp.com" target="_blank" rel="noopener noreferrer">
                Praetor App
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Footer)
