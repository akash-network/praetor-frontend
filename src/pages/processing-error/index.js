import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import Swal from 'sweetalert2'
import style from './style.module.scss'

const processingError = ({ dispatch, becomingProvider }) => {
  const onDispatchReset = () => {
    dispatch({
      type: 'user/START_OVER',
    })
  }

  const startOver = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff7043',
      cancelButtonColor: '#cdcdcd',
      confirmButtonText: 'Yes, Reset the progress!',
    }).then((result) => {
      if (result.isConfirmed) {
        onDispatchReset()
      }
    })
  }
  return (
    <div className="container">
      <div className={`${style.background}`}>
        <div className="col-12">
          <div className="row">
            <div className={`${style.img_align}`}>
              <img src="/resources/images/content/processing_error.png" alt="Processing error" />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12">
              <h5 className={`${style.h5}`}>Error While Processing</h5>
            </div>
            <div className="col-12 text-center mt-4">{becomingProvider.progress.description}</div>
          </div>
          <div className="row mt-5">
            <div className="col-12 text-center">
              <Button
                htmlType="submit"
                size="large"
                className={`${style.connect_button}`}
                onClick={() => startOver()}
              >
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ dispatch, becomingProvider }) => ({ dispatch, becomingProvider })

export default connect(mapStateToProps)(processingError)
