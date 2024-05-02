import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import Layout from 'layouts'

const routes = [
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/become-provider',
    Component: lazy(() => import('pages/become-provider')),
    exact: true,
  },
  {
    path: '/dashboard',
    Component: lazy(() => import('pages/dashboard')),
    exact: true,
  },
  {
    path: '/provider-settings',
    Component: lazy(() => import('pages/provider-settings')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
  },
  {
    path: '/processing-error',
    Component: lazy(() => import('pages/processing-error')),
    exact: true,
  },
  {
    path: '/calculator',
    Component: lazy(() => import('pages/calculator')),
    exact: true,
  },
  {
    path: '/provider-status',
    Component: lazy(() => import('pages/provider-status')),
    exact: true,
  },
  {
    path: '/provider-deployments',
    Component: lazy(() => import('pages/provider-deployments')),
    exact: true,
  },
  {
    path: '/provider-deployments/:owner/:dseq',
    Component: lazy(() => import('pages/provider-deployments')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={(state) => {
            const { location } = state
            return (
              <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    {/* VB:REPLACE-NEXT-LINE:ROUTER-REDIRECT */}
                    <Route exact path="/" render={() => <Redirect to="/auth/login" />} />
                    {routes.map(({ path, Component, exact }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact}
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                <Component />
                              </Suspense>
                            </div>
                          )
                        }}
                      />
                    ))}
                    <Redirect to="/auth/404" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            )
          }}
        />
      </Layout>
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
