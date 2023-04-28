import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
  mutation Mutation($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      accessToken
      email
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
