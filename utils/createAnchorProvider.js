import { AnchorProvider } from '@project-serum/anchor'

import { Connection, Keypair } from '@solana/web3.js'
import { RPC_URL, HELLO_MOON_KEY } from 'app/constants/api'

export const connection = new Connection(RPC_URL, 'confirmed')

const createAnchorProvider = (pubKey = null) => {
  const provider = new AnchorProvider(
    connection,
    { publicKey: pubKey ? pubKey : Keypair.generate().publicKey },
    {
      maxRetries: 2,
    }
  )

  // const provider = new AnchorProvider(
  //   new Connection(RPC_URL, {
  //     httpHeaders: {
  //       Authorization: `Bearer ${HELLO_MOON_KEY}`,
  //     },
  //   }),
  //   { publicKey: Keypair.generate().publicKey },
  //   {
  //     maxRetries: 2,
  //   }
  // )

  provider.connection._confirmTransactionInitialTimeout = 180_000

  return provider
}

export default createAnchorProvider
