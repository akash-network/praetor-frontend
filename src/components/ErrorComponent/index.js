import React from 'react'
import { connect } from 'react-redux'
import style from './style.module.scss'

const ErrorComponent = () => {
  return (
    <div className={`${style.background}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className={`${style.img_content}`}>
              <img
                src="/resources/images/content/error_404.png"
                height="450"
                alt="Error"
                className={`${style.img_responsive}`}
              />
              <div style={{ textAlign: 'center' }}>
                <h3>
                  Error Occured during processing!
                  <br /> Please start over.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ dispatch }) => ({
  dispatch,
})

export default connect(mapStateToProps)(ErrorComponent)
