import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import {
  BackpackWalletAdapter,
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-phantom'
// import { confirmTransactionFromBackend } from './shyft.js'

export async function connectTheWallet(wallet) {
  const { solana } = window
  let res = { success: false, message: 'Could not connect wallet', addr: '' }
  let walletAdapter

  if (!solana) {
    console.log('Please Install Phantom')
  }

  try {
    const network = 'mainnet-beta'

    if (wallet === 'Phantom') {
      walletAdapter = new PhantomWalletAdapter()
      //await phantom.disconnect();
    } else if (wallet === 'Backpack') {
      walletAdapter = new BackpackWalletAdapter()
    }

    await walletAdapter.connect()

    const rpcUrl = clusterApiUrl(network)
    const connection = new Connection(rpcUrl, 'confirmed')

    const wallet = {
      address: walletAdapter.publicKey.toBase58(),
    }

    if (wallet.address) {
      const accountInfo = await connection.getAccountInfo(
        new PublicKey(wallet.address),
        'confirmed'
      )
      //console.log(accountInfo);
      console.log('Wallet Connected')
      res.success = true
      res.message = 'Wallet connected successfully'
      res.addr = wallet.address
    }
  } catch (err) {
    console.log(err)
  }
  return res
}

// export async function signAndConfirmTransaction(
//   network,
//   transaction,
//   callback,
//   prvKey
// ) {
//   const phantom = new PhantomWalletAdapter()
//   await phantom.connect()
//   const rpcUrl = clusterApiUrl(network)
//   const connection = new Connection(rpcUrl, 'confirmed')
//   const ret = await confirmTransactionFromBackend(network, transaction, prvKey)
//   console.log(ret)

//   connection.onSignature(ret, callback, 'finalized')
//   return ret
// }
