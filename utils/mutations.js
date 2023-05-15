import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
  mutation Mutation($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      username
    }
  }
`

export const REGISTER_USER = gql`
  mutation Mutation($password: String!, $email: String!) {
    register(password: $password, email: $email) {
      email
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
  mutation Mutation($coinData: CoinData!) {
    addUserCoin(coinData: $coinData) {
      id
      name
      symbol
      walletName
      holdings
    }
  }
`

export const DELETE_USER_COIN = gql`
  mutation Mutation($coinData: CoinData!) {
    deleteUserCoin(coinData: $coinData)
  }
`
export const DELETE_USER_COIN_BY_SYMBOL = gql`
  mutation Mutation($symbol: String!) {
    deleteUserCoinBySymbol(symbol: $symbol)
  }
`

export const EDIT_USER_COIN = gql`
  mutation Mutation($coinData: CoinData!) {
    editUserCoin(coinData: $coinData) {
      id
      name
      symbol
      walletName
      holdings
    }
  }
`
