import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
import { getStorageItem } from 'services/local-storage'
import { history } from 'index'
import PublicLayout from './Public'
import MainLayout from './Main'
import AuthLayout from './Auth'
import ExtraLayout from './Extra'

const Layouts = {
  public: PublicLayout,
  main: MainLayout,
  auth: AuthLayout,
  extra: ExtraLayout,
}

const mapStateToProps = ({ dispatch, settings }) => ({
  dispatch,
  title: settings.logo,
  settings,
})
let previousPath = ''

const Layout = ({ children, title, location: { pathname, search }, settings, dispatch }) => {
  // NProgress & ScrollTop Management

  dispatch({
    type: 'settings/CHECK_VERSION',
    payload: {
      version: settings.version,
    },
  })

  const currentPath = pathname + search
  if (currentPath !== previousPath) {
    window.scrollTo(0, 0)
    NProgress.start()
  }
  setTimeout(() => {
    NProgress.done()
    previousPath = currentPath
  }, 300)

  const getLayout = () => {
    if (pathname === '/' || pathname === '/become-provider' || pathname === '/processing-error') {
      return 'public'
    }

    if (pathname === '/calculator' || pathname === '/provider-status') {
      return 'extra'
    }

    if (/^\/auth(?=\/|$)/i.test(pathname)) {
      return 'auth'
    }
    return 'main'
  }

  const checkUserIsLoggedIn = () => {
    if (
      getLayout() !== 'auth' &&
      !getStorageItem('accessToken') &&
      pathname !== '/calculator' &&
      pathname !== '/provider-status'
    ) {
      history.push('/auth/login')
    }
  }
  checkUserIsLoggedIn()

  const Container = Layouts[getLayout()]

  const BootstrappedLayout = () => {
    return <Container>{children}</Container>
  }

  return (
    <Fragment>
      <Helmet titleTemplate={`${title} | %s`} title={title} />
      {BootstrappedLayout()}
    </Fragment>
  )
}

export default withRouter(connect(mapStateToProps)(Layout))
