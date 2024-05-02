import store from 'store'
import actions from './actions'

const STORED_SETTINGS = (storedSettings) => {
  const settings = {}
  Object.keys(storedSettings).forEach((key) => {
    const item = store.get(`app.settings.${key}`)
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key]
  })
  return settings
}

export const initialState = {
  ...STORED_SETTINGS({
    // Read docs for available values: https://docs.visualbuilder.cloud
    // VB:REPLACE-START:SETTINGS
    authProvider: 'jwt',
    logo: 'Praetor',
    version: 'v0.10.3',
    theme: 'default',
    locale: 'en-US',
    isSidebarOpen: false,
    isSupportChatOpen: false,
    isMobileView: false,
    isMobileMenuOpen: false,
    isMenuCollapsed: false,
    isPreselectedOpen: false,
    preselectedVariant: 'default',
    menuLayoutType: 'left',
    routerAnimation: 'slide-fadein-up',
    menuColor: 'gray',
    authPagesColor: 'gray',
    isAuthTopbar: true,
    primaryColor: '#ff7043',
    leftMenuWidth: 256,
    isMenuUnfixed: false,
    isMenuShadow: false,
    isTopbarFixed: false,
    isTopbarSeparated: false,
    isGrayTopbar: false,
    isContentMaxWidth: false,
    isAppMaxWidth: false,
    isGrayBackground: false,
    isCardShadow: true,
    isSquaredBorders: false,
    isBorderless: false,
    layoutMenu: 'classic',
    layoutTopbar: 'v1',
    layoutBreadcrumbs: 'v1',
    layoutFooter: 'v1',
    flyoutMenuType: 'flyout',
    flyoutMenuColor: 'blue',

    // VB:REPLACE-END:SETTINGS
  }),
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
