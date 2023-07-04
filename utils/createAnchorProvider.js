import { AnchorProvider } from '@project-serum/anchor'
import Wallet from '@project-serum/anchor/dist/cjs/nodewallet'

import { Connection, Keypair } from '@solana/web3.js'
import { HELLO_MOON_RPC_URL } from 'application/constants/api'

export const connection = new Connection(HELLO_MOON_RPC_URL, 'confirmed')

const createAnchorProvider = (wallet) => {
  const provider = new AnchorProvider(
    connection,
    wallet ?? new Wallet(Keypair.generate()),
    {
      maxRetries: 2,
    }
  )

  provider.connection._confirmTransactionInitialTimeout = 180_000

  return provider
}

export default createAnchorProvider
