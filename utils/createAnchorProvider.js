import { AnchorProvider } from '@project-serum/anchor'
import Wallet from '@project-serum/anchor/dist/cjs/nodewallet'

import { Connection, Keypair } from '@solana/web3.js'
import { RPC_URL, HELLO_MOON_KEY } from 'app/constants/api'

export const connection = new Connection(RPC_URL, 'confirmed')
// export const connection = new Connection(RPC_URL, {
//   httpHeaders: {
//     Authorization: `Bearer ${HELLO_MOON_KEY}`,
//   },
// })

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
