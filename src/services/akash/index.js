import { SigningStargateClient } from '@cosmjs/stargate'
import { MsgUpdateProvider } from '@akashnetwork/akashjs/build/protobuf/akash/provider/v1beta3/provider'
import { stargate as akashStargate } from '@akashnetwork/akashjs'
import { Registry } from '@cosmjs/proto-signing'

export async function updateProvider(request) {
  return new Promise(async (resolve, reject) => {
    const { hostUri, attributes, signingClient, address } = request
    try {
      const message = MsgUpdateProvider.fromPartial({
        owner: address,
        hostUri,
        attributes,
      })
      const msgAny = {
        typeUrl: akashStargate.getTypeUrl(MsgUpdateProvider),
        value: message,
      }
      const signedMessage = await signingClient.signAndBroadcast(
        address,
        [msgAny],
        'auto',
        'Update Provider',
      )
      resolve(signedMessage)
      // resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

export async function signin(selectedChain) {
  return new Promise(async (resolve, reject) => {
    try {
      const offlineSigner = window.getOfflineSigner(selectedChain.chainId)
      const RPC = selectedChain.rpc
      const myRegistry = new Registry([...akashStargate.getAkashTypeRegistry()])
      const signingClient = await SigningStargateClient.connectWithSigner(RPC, offlineSigner, {
        registry: myRegistry,
        gasPrice: '0.025uakt',
      })
      const accounts = await offlineSigner.getAccounts()
      const { address } = accounts[0]
      resolve({ signingClient, address })
    } catch (error) {
      reject(error)
    }
  })
}
