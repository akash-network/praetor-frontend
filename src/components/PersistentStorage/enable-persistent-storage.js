import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import style from './style.module.scss'

const EnablePersistentStorage = ({ onEnablePersistentStorage, persistentStorage, dispatch }) => {
  const tryAgain = () => {
    dispatch({
      type: 'persistentStorage/GET_DRIVES',
    })
  }

  const onClickContinue = () => {
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        akashStep: 'akashWalletImport',
      },
    })
  }

  return (
    <div className="row">
      <div className="d-none d-sm-none d-md-block col-md-6 col-lg-6 col-xl-6">
        <div className={`${style.background_white}  pb-5 pt-5`}>
          <div className="row">
            <div className="col-12">
              <img
                src="/resources/images/content/persistent-storage.png"
                height="400"
                alt="Persistent Storage"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 pr-5">
        <div className={`${style.background_white}`}>
          <div className="container">
            <div className="row">
              <div className="col-12 mb-4">
                <h1 className={`${style.heading}`}>Persistent Storage</h1>
              </div>
            </div>
            {persistentStorage.drives.length > 0 && (
              <div className="row">
                <div className="col-12 mt-3 mb-5">
                  <div>
                    <div className={`${style.content_question}`}>
                      Do you want to enable persistent storage?
                    </div>
                    <h3 className={`${style.content_sub}`}>
                      We found{' '}
                      <span className={`${style.highlight_text}`}>
                        <strong>{persistentStorage.drives.length}</strong>
                      </span>{' '}
                      unformatted drives in your servers.
                    </h3>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <Button
                        onClick={() => onEnablePersistentStorage(true)}
                        size="large"
                        className={`${style.yes_button}`}
                      >
                        Yes
                      </Button>
                      <Button
                        onClick={() => onEnablePersistentStorage(false)}
                        size="large"
                        className={`ml-3 ${style.no_button}`}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {persistentStorage.drives.length === 0 && (
              <div className="row">
                <div className="col-12 mb-5">
                  <div>
                    <div className={`${style.content_sub}`}>
                      No unformatted drive found in servers.
                    </div>
                    <div className={`${style.content_question}`}>
                      Do you want to continue without persistent storage?
                    </div>
                    <div className="mt-2">
                      Note: Click try again after adding additional drives.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <Button
                        onClick={() => onClickContinue(true)}
                        size="large"
                        className={`${style.yes_button}`}
                      >
                        Continue
                      </Button>
                      <Button
                        onClick={() => tryAgain(false)}
                        type="link"
                        size="large"
                        className="ml-3"
                        loading={persistentStorage.loading}
                      >
                        Try again
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ dispatch, persistentStorage }) => ({
  dispatch,
  persistentStorage,
})
export default connect(mapStateToProps)(EnablePersistentStorage)
