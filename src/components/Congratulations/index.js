import { Button } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import style from './style.module.scss'

const Congratulations = ({ dispatch }) => {
  const onNext = () => {
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        akashStep: 'providerPorts',
      },
    })
  }

  return (
    <div className="container-full">
      <div className={`${style.background}`}>
        <div className="row">
          <div className="d-none d-sm-none d-md-block col-md-4 col-lg-6 col-xl-4">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <img
                    src="/resources/images/content/congratulations.png"
                    height="300"
                    alt="Congratulations"
                    className={`${style.congrats_logo}`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-8 col-lg-6 col-xl-8">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div>
                    <h1 className={`${style.h1}`}>Congratulations on Becoming an Akash Provider</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-12 mt-4">
                  <Button
                    onClick={() => onNext()}
                    size="large"
                    className={`ml-3 ${style.next_button}`}
                  >
                    Next
                  </Button>
                </div>
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

export default connect(mapStateToProps)(Congratulations)
