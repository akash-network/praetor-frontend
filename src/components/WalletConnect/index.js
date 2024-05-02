import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Select, notification } from 'antd'
import { stargate as akashStargate } from '@akashnetwork/akashjs/build'
import { SigningStargateClient } from '@cosmjs/stargate'
import { Registry } from '@cosmjs/proto-signing'
import { persistor } from 'index'
import style from './style.module.scss'

const generticErrorMessage = 'Error Occurred, Please try again!'

const notifyError = (error = { message: generticErrorMessage }) => {
  notification.error({
    duration: 10,
    message: error.message,
  })
}

const WalletConnect = ({ user, dispatch }) => {
  const [chainSelected, setChainSelected] = useState(
    JSON.stringify({
      chainId: 'akashnet-2',
      chainName: 'Akash',
      rpc: process.env.REACT_APP_RPC_URL,
      experimental: false,
      rest: null,
    }),
  )

  useEffect(() => {
    persistor.purge()
    localStorage.clear()
  }, [])

  const onConnect = async () => {
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        loading: true,
      },
    })

    dispatch({
      type: 'chain/SELECT_CHAIN',
      payload: {
        chainSelected,
      },
    })

    const chainJson = JSON.parse(chainSelected)

    if (window.keplr) {
      if (chainJson.chainId !== 'akashnet-2') {
        await window.keplr.experimentalSuggestChain(chainJson)
      }
      try {
        await window.keplr.enable(chainJson.chainId)
        const offlineSigner = window.getOfflineSigner(chainJson.chainId)
        const RPC = chainJson.rpc
        const accounts = await offlineSigner.getAccounts()
        const { address } = accounts[0]

        const myRegistry = new Registry([...akashStargate.getAkashTypeRegistry()])

        const signingClient = await SigningStargateClient.connectWithSigner(RPC, offlineSigner, {
          registry: myRegistry,
          gasPrice: '0.025uakt',
        })

        signingClient
          .getAllBalances(address)
          .then((result) => {
            let walletBalance = '1'
            result.forEach((obj) => {
              if (obj.denom === 'uakt') {
                walletBalance = obj.amount
              }
            })
            dispatch({
              type: 'user/NOUNCE',
              payload: {
                walletAddress: address,
                balance: walletBalance,
              },
            })
          })
          .catch(() => {
            notifyError({
              message: "You don't have enough AKT balance to enable your provider machine!",
            })
            dispatch({
              type: 'user/SET_STATE',
              payload: {
                loading: false,
              },
            })
          })
      } catch (error) {
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            loading: false,
          },
        })
        notifyError(error)
      }
    } else {
      window.open(
        'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
        '_blank',
      )
    }
  }
  return (
    <div className={`${style.background}`}>
      <div className="container">
        <div className="row">
          <div className="col-12 mb-3">
            <div className={`${style.logo}`}>
              <img
                src="/resources/images/logo/edge_white_full.png"
                width="300"
                alt="Praetor Logo"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h1 className={`${style.h1}`}>Become an Akash Provider</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mb-3 ml-2">
            <h6 className="text-white">
              In order to become provider you should have minimum 5AKT in your wallet
            </h6>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Button
              onClick={() => onConnect()}
              size="large"
              className={`pl-4 pr-4 ${style.connect_button}`}
              loading={user.loading}
            >
              {user.loading ? 'Checking' : 'Connect'}
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mb-2 mt-4 ml-2">
            <h6 className="text-white">
              Important: Selecting the {process.env.REACT_APP_TESTNET_NAME} option involves certain
              risks and should be done only for experimental purposes. <br />
              Transactions and data on the {process.env.REACT_APP_TESTNET_NAME} are not real. Use{' '}
              {process.env.REACT_APP_TESTNET_NAME} at your own discretion.
            </h6>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Select
              value={chainSelected}
              // size="large"
              className={`${style.select_button}`}
              onChange={(val) => setChainSelected(val)}
              options={[
                {
                  value: JSON.stringify({
                    chainId: 'akashnet-2',
                    chainName: 'Akash',
                    rpc: process.env.REACT_APP_RPC_URL,
                    experimental: false,
                    rest: null,
                  }),
                  label: 'Mainnet',
                },
                {
                  value: JSON.stringify({
                    chainId: process.env.REACT_APP_TESTNET_CHAIN_ID,
                    chainName: process.env.REACT_APP_TESTNET_NAME,
                    rpc: process.env.REACT_APP_RPC_URL_TESTNET,
                    rest: process.env.REACT_APP_API_URL_TESTNET,
                    experimental: true,
                    bip44: {
                      coinType: 118,
                    },
                    bech32Config: {
                      bech32PrefixAccAddr: 'akash',
                      bech32PrefixAccPub: 'akashpub',
                      bech32PrefixValAddr: 'akashvaloper',
                      bech32PrefixValPub: 'akashvaloperpub',
                      bech32PrefixConsAddr: 'akashvalcons',
                      bech32PrefixConsPub: 'akashvalconspub',
                    },
                    currencies: [
                      {
                        coinDenom: 'AKT',
                        coinMinimalDenom: 'uakt',
                        coinDecimals: 6,
                        coinGeckoId: 'akt',
                      },
                    ],
                    feeCurrencies: [
                      {
                        coinDenom: 'AKT',
                        coinMinimalDenom: 'uakt',
                        coinDecimals: 6,
                        coinGeckoId: 'akt',
                        gasPriceStep: {
                          low: 0.01,
                          average: 0.025,
                          high: 0.04,
                        },
                      },
                    ],
                    stakeCurrency: {
                      coinDenom: 'AKT',
                      coinMinimalDenom: 'uakt',
                      coinDecimals: 6,
                      coinGeckoId: 'akt',
                    },
                  }),
                  label: process.env.REACT_APP_TESTNET_NAME,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ user, chain, dispatch }) => ({
  dispatch,
  user,
  chain,
})
export default connect(mapStateToProps)(WalletConnect)
