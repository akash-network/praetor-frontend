import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import style from './style.module.scss'

const AkashKubernetesGuide = ({ dispatch }) => {
  const [readMe, setReadMe] = useState()

  const onKubeReady = () => {
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        akashStep: 'controlMachine',
      },
    })
  }

  useEffect(() => {
    const url = 'https://raw.githubusercontent.com/PraetorOne/kube-sh/main/README.md'
    fetch(url)
      .then((response) => response.text())
      .then((res) => setReadMe(res))
  })

  return (
    <div className={style.background_white}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className={style.background_red}>
              <div className="row">
                <div className="col-12">
                  <h1 className={`${style.h1}`}>Akash Kubernetes Guide</h1>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <div className="kube-guide">
                    <ReactMarkdown rehypePlugins={rehypeHighlight}>{readMe}</ReactMarkdown>
                  </div>
                </div>
              </div>
              <div className="row mt-4 mb-5">
                <div className="col-12">
                  <Button
                    onClick={() => onKubeReady()}
                    size="large"
                    className={`${style.kubeready_button}`}
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

const mapStateToProps = ({ user, dispatch }) => ({
  dispatch,
  user,
})

export default connect(mapStateToProps)(AkashKubernetesGuide)
