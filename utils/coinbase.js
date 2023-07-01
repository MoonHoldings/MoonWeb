import {
  COINBASE_CLIENT,
  COINBASE_SECRET,
  COINBASE_URL,
  BEND_URL,
} from 'application/constants/api'
import { Issuer } from 'openid-client'

const CoinbaseIssuerConfig = {
  issuer: 'https://www.coinbase.com',
  authorization_endpoint: 'https://www.coinbase.com/oauth/authorize',
  token_endpoint: `${COINBASE_URL}/oauth/token`,
  userinfo_endpoint: `${COINBASE_URL}/v2/user`,
}
const coinbaseIssuer = new Issuer(CoinbaseIssuerConfig)

export const coinbaseClient = new coinbaseIssuer.Client({
  client_id: COINBASE_CLIENT,
  client_secret: COINBASE_SECRET,
  redirect_uris: [`${BEND_URL}/auth/coinbase`],
  response_types: ['code'],
})
