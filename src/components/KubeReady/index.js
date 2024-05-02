import React from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'antd'
import style from './style.module.scss'

const KubeReady = ({ dispatch }) => {
  const onClickOneServer = () => {
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        kubeBuild: {
          status: true,
          type: 'k3s',
        },
        akashStep: 'controlMachine',
      },
    })
  }
  const onClickMultiServer = () => {
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        kubeBuild: {
          status: true,
          type: 'k8s',
        },
        akashStep: 'controlMachine',
      },
    })
  }

  const onClickSkip = () => {
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        kubeBuild: {
          status: false,
          type: null,
        },
        akashStep: 'controlMachine',
      },
    })
  }

  return (
    <div className={`${style.background}`}>
      <div className="container">
        <div className="mt-5">
          <Form requiredMark="optional" name="basic">
            <div className="row">
              <div className="col-12 mt-5">
                <h1 className={`${style.h1}`}>Kubernetes Build</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-5">
                <h2 className={`${style.h2}`}>How many servers are you providing to Akash?</h2>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-3 col-sm-2 col-md-2 col-lg-1 col-xl-1 mr-3">
                <Button
                  onClick={() => onClickOneServer()}
                  size="large"
                  className={`${style.yes_button}`}
                >
                  1 Server
                </Button>
              </div>
              <div className="col-3 col-sm-2 col-md-2 col-lg-1 col-xl-3 ml-5">
                <Button
                  size="large"
                  onClick={() => onClickMultiServer()}
                  className={`${style.multiple_server_button}`}
                >
                  More than 1
                </Button>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-5">
                <Button onClick={() => onClickSkip()} className={`${style.h5}`}>
                  Skip this step if you have kubernetes
                </Button>
              </div>
            </div>
          </Form>
        </div>
        <div className="row">
          <div className="d-none d-sm-none d-md-block col-lg-12 col-xl-12">
            <img
              className={`${style.kubeReadyLogo} float-right`}
              src="/resources/images/content/kubernetes_ready.png"
              height="400"
              width="400"
              alt="KubeReady Logo"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = ({ dispatch }) => ({
  dispatch,
})
export default connect(mapStateToProps)(KubeReady)
