import { all, takeEvery, put, call } from 'redux-saga/effects'
import store from 'store'
import qs from 'qs'
import Swal from 'sweetalert2'
import { purgeStorage } from 'services/local-storage'
import { history, store as reduxStore } from 'index'
import actions from './actions'
import { initialState } from './reducers'

export function* CHANGE_SETTING({ payload: { setting, value } }) {
  yield store.set(`app.settings.${setting}`, value)
  yield put({
    type: 'settings/SET_STATE',
    payload: {
      [setting]: value,
    },
  })
}

export function* CHANGE_SETTING_BULK({ payload }) {
  const settings = {}
  Object.keys(payload).forEach((key) => {
    store.set(`app.settings.${key}`, payload[key])
    settings[key] = payload[key]
  })

  yield put({
    type: 'settings/SET_STATE',
    payload: { ...settings },
  })
}

export function* CHECK_VERSION({ payload }) {
  if (initialState.version !== payload.version) {
    yield call(
      () =>
        new Promise((resolve) => {
          Swal.fire({
            icon: 'warning',
            title: 'New Version is available.',
            text: 'Please continue to update.',
            confirmButtonText: 'Continue',
            confirmButtonColor: '#ff7043',
          }).then(() => {
            resolve(true)
          })
        }),
    )
    purgeStorage()
    window.location.reload()
  }
}

export function* SETUP() {
  // load settings from url on app load

  const changeSettings = (search) => {
    const query = qs.parse(search, { ignoreQueryPrefix: true })
    Object.keys(query).forEach((key) => {
      let value
      switch (query[key]) {
        case 'false':
          value = false
          break
        case 'true':
          value = true
          break
        default:
          value = query[key]
          break
      }
      reduxStore.dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: key,
          value,
        },
      })
    })
  }
  yield changeSettings(history.location.search)
  yield history.listen((params) => {
    const { search } = params
    changeSettings(search)
  })

  // detect isMobileView setting on app load and window resize
  const isMobileView = (load = false) => {
    const currentState = global.window.innerWidth < 768
    const prevState = store.get('app.settings.isMobileView')
    if (currentState !== prevState || load) {
      reduxStore.dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isMobileView',
          value: currentState,
        },
      })
    }
  }

  // detect viewport width on app load and window resize
  const isMenuToggled = () => {
    const shouldToggle = global.window.innerWidth < 1024
    const prevState = store.get('app.settings.isMenuCollapsed')
    if (shouldToggle || prevState) {
      reduxStore.dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isMenuCollapsed',
          value: true,
        },
      })
    }
  }

  yield isMobileView(true)
  yield isMenuToggled()
  yield window.addEventListener('resize', () => {
    isMobileView()
    isMenuToggled()
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING),
    takeEvery(actions.CHANGE_SETTING_BULK, CHANGE_SETTING_BULK),
    takeEvery(actions.CHECK_VERSION, CHECK_VERSION),
    SETUP(), // run once on app load to init listeners
  ])
}
