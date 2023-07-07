import {
  COINBASE_CLIENT,
  COINBASE_SECRET,
  COINBASE_URL,
  BEND_URL,
} from 'application/constants/api'
import { Issuer } from 'openid-client'

const CoinbaseIssuerConfig = {
  issuer: 'https://exchange.sandbox.gemini.com',
  authorization_endpoint: 'https://exchange.sandbox.gemini.com/auth',
  token_endpoint: `https://exchange.sandbox.gemini.com/oauth/token`,
  // userinfo_endpoint: `https://exchange.sandbox.gemini.com/v2/user`,
}
const coinbaseIssuer = new Issuer(CoinbaseIssuerConfig)

export const coinbaseClient = new coinbaseIssuer.Client({
  client_id: '64a6ea62-8052-4a97-b85f-f90a2155151a',
  client_secret: '64a6ea62-c13a-4f94-881f-9c7a5aa35ee3',
  redirect_uris: [`https://api.moonholdings.xyz/auth/gemini`],
  response_types: ['code'],
})
