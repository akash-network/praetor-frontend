import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import style from './style.module.scss'
import 'react-circular-progressbar/dist/styles.css'

const AkashProvider = ({ becomingProvider, user, dispatch }) => {
  useEffect(() => {
    let interval = 0
    if (user.akashStep === 'installingK3S') {
      interval = setInterval(() => {
        dispatch({
          type: 'becomingProvider/INSTALL_K3S_STATUS',
        })
      }, 2500)
    } else if (user.akashStep === 'akashProvider') {
      interval = setInterval(() => {
        dispatch({
          type: 'becomingProvider/PROVIDER_STATUS',
          payload: {
            manual: true,
          },
        })
      }, 2500)
    }

    return () => clearInterval(interval)
  }, [dispatch, user.akashStep])

  return (
    <div className={`${style.background_white}`}>
      <div className={`container ${style.container}`}>
        <div className="row">
          <div className={`${style.background_red}`}>
            <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-9">
              <div className="row">
                <div className="col-12">
                  {user.akashStep === 'installingK3S' ? (
                    <img
                      src="/resources/images/content/install_k3s.png"
                      height="200"
                      alt="Becoming Akash Provider"
                      className={`${style.img_responsive}`}
                    />
                  ) : (
                    <img
                      src="/resources/images/content/becoming_akash_provider.png"
                      height="200"
                      alt="Becoming Akash Provider"
                      className={`${style.img_responsive}`}
                    />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12 mt-5">
                  {user.akashStep === 'installingK3S' ? (
                    <h1 className={`${style.h1}`}>
                      {becomingProvider.progress.description
                        ? becomingProvider.progress.description
                        : 'Installing K3S...'}
                    </h1>
                  ) : (
                    <h1 className={`${style.h1}`}>
                      {becomingProvider.progress.description
                        ? becomingProvider.progress.description
                        : 'Becoming Provider...'}
                    </h1>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12 mt-4">
                  <div className={`${style.subText}`}>
                    This process may take few minutes, Please enjoy your coffee and relax.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-3">
              <div className={`${style.imgAndProgressAlign}`}>
                <img src="/resources/images/content/Macbook.png" height="300" alt="Macbook" />
                <div className={`${style.progressBar}`}>
                  <CircularProgressbar
                    text={`${becomingProvider.progress.percentage}%`}
                    value={becomingProvider.progress.percentage}
                    background
                    styles={{
                      path: {
                        stroke: `rgb(255, 138, 101)`,
                        strokeLinecap: 'butt',
                      },
                      text: {
                        fill: '#fff',
                        fontSize: '16px',
                      },
                      background: {
                        fill: '#ff7043',
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ becomingProvider, user, dispatch }) => ({
  dispatch,
  becomingProvider,
  user,
})
export default connect(mapStateToProps)(AkashProvider)
