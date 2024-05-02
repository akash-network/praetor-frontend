import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import controlMachine from './control-machine/reducers'
import walletImport from './wallet-import/reducers'
import providerConfig from './provider-config/reducers'
import chain from './chain/reducers'
import resources from './resources/reducers'
import becomingProvider from './become-provider/reducers'
import nodeAccess from './node-access/reducers'
import activeProcess from './active-process/reducers'
import dashboard from './dashboard/reducers'
import persistentStorage from './persistent-storage/reducers'

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    controlMachine,
    walletImport,
    providerConfig,
    chain,
    resources,
    becomingProvider,
    nodeAccess,
    activeProcess,
    dashboard,
    persistentStorage,
  })
