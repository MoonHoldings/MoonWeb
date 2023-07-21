import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
  mutation Mutation($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      username
      accessToken
      id
    }
  }
`

export const REGISTER_USER = gql`
  mutation Mutation($password: String!, $email: String!) {
    register(password: $password, email: $email) {
      email
      isVerified
    }
  }
`
export const UPDATE_PASSWORD = gql`
  mutation Mutation($password: String!) {
    updatePassword(password: $password)
  }
`
export const LOGOUT_USER = gql`
  mutation Mutation {
    logout
  }
`

export const CREATE_LOANS = gql`
  mutation CreateLoans($loans: [CreateLoan!]!) {
    createLoans(loans: $loans) {
      id
      pubKey
    }
  }
`

export const DELETE_LOAN_BY_PUBKEY = gql`
  mutation DeleteLoanByPubKey($pubKey: String!) {
    deleteLoanByPubKey(pubKey: $pubKey)
  }
`

export const BORROW_LOAN = gql`
  mutation BorrowLoan($borrowedLoan: BorrowLoan!) {
    borrowLoan(borrowedLoan: $borrowedLoan) {
      id
      pubKey
    }
  }
`

export const ADD_USER_COIN = gql`
  mutation Mutation($walletAddress: String!, $coinData: CoinData!) {
    addUserCoin(walletAddress: $walletAddress, coinData: $coinData) {
      id
      name
      symbol
      walletName
      holdings
    }
  }
`

export const DELETE_USER_COIN = gql`
  mutation Mutation($walletAddress: String!, $coinData: CoinData!) {
    deleteUserCoin(walletAddress: $walletAddress, coinData: $coinData)
  }
`
export const DELETE_USER_COIN_BY_SYMBOL = gql`
  mutation Mutation($walletAddress: String!, $symbol: String!) {
    deleteUserCoinBySymbol(walletAddress: $walletAddress, symbol: $symbol)
  }
`

export const ADD_USER_WALLET = gql`
  mutation AddUserWallet($verified: Boolean!, $wallet: String!) {
    addUserWallet(verified: $verified, wallet: $wallet)
  }
`

export const REMOVE_USER_WALLET = gql`
  mutation RemoveUserWallet($wallet: String!) {
    removeUserWallet(wallet: $wallet)
  }
`

export const REMOVE_ALL_USER_WALLETS = gql`
  mutation RemoveAllUserWallets($isExchange: Boolean!) {
    removeAllUserWallets(isExchange: $isExchange)
  }
`

export const EDIT_USER_COIN = gql`
  mutation Mutation($coinData: CoinData!, $walletAddress: String!) {
    editUserCoin(coinData: $coinData, walletAddress: $walletAddress) {
      id
      name
      symbol
      walletName
      holdings
    }
  }
`

export const REFRESH_USER_WALLETS = gql`
  mutation RefreshUserWallets($wallets: [String!]!) {
    refreshUserWallets(wallets: $wallets)
  }
`

export const ADD_EXCHANGE_COINS = gql`
  mutation Mutation($walletAddress: String, $exchangeInfo: ExchangeInfo) {
    addExchangeCoins(walletAddress: $walletAddress, exchangeInfo: $exchangeInfo)
  }
`

export const CONNECT_PLAID_DETAILS = gql`
  mutation Mutation($publicToken: String!) {
    connectPlaidDetails(public_token: $publicToken)
  }
`

export const REMOVE_EXCHANGE_WALLETS = gql`
  mutation Mutation($exchangeAddress: String!, $walletAddress: String!) {
    removeExchangeWallet(
      exchangeAddress: $exchangeAddress
      walletAddress: $walletAddress
    )
  }
`
