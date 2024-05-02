import { all } from 'redux-saga/effects'
import user from './user/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import controlMachine from './control-machine/sagas'
import walletImport from './wallet-import/sagas'
import providerConfig from './provider-config/sagas'
import resources from './resources/sagas'
import becomingProvider from './become-provider/sagas'
import nodeAccess from './node-access/sagas'
import activeProcess from './active-process/sagas'
import persistentStorage from './persistent-storage/sagas'
import chain from './chain/sagas'

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    settings(),
    controlMachine(),
    walletImport(),
    providerConfig(),
    becomingProvider(),
    resources(),
    nodeAccess(),
    activeProcess(),
    persistentStorage(),
    chain(),
  ])
}
