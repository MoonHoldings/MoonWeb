import {
  GEMINI_CLIENT,
  GEMINI_SECRET,
  GEMINI_URL,
  BEND_URL,
} from 'application/constants/api'
import { Issuer } from 'openid-client'

const GeminiIssuerConfig = {
  issuer: GEMINI_URL,
  authorization_endpoint: `${GEMINI_URL}/auth`,
  token_endpoint: `${GEMINI_URL}/oauth/token`,
}
const geminiIssuer = new Issuer(GeminiIssuerConfig)

export const geminiClient = new geminiIssuer.Client({
  client_id: GEMINI_CLIENT,
  client_secret: GEMINI_SECRET,
  redirect_uris: [`https://api.moonholdings.xyz/auth/gemini`],
  response_types: ['code'],
})
