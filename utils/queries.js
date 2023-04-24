import { gql } from '@apollo/client'

export const MY_OFFERS = gql`
  query MyOffers($args: GetLoansArgs) {
    getLoans(args: $args) {
      count
      data {
        pubKey
        principalLamports
        offerTime
        orderBook {
          nftList {
            collectionImage
            collectionName
            floorPriceSol
            nftMint
          }
          apy
          apyAfterFee
          duration
          feePermillicentage
        }
        state
      }
    }
  }
`

export const MY_LOANS = gql`
  query MyOffers($args: GetLoansArgs) {
    getLoans(args: $args) {
      count
      data {
        pubKey
        principalLamports
        offerTime
        orderBook {
          nftList {
            collectionImage
            collectionName
            floorPriceSol
            nftMint
          }
          apy
          apyAfterFee
          duration
          feePermillicentage
        }
        state
      }
    }
  }
`

export const GET_ORDER_BOOKS = gql`
  query GetOrderBooks($args: GetOrderBooksArgs) {
    getOrderBooks(args: $args) {
      count
      data {
        id
        pubKey
        duration
        apy
        apyAfterFee
        feePermillicentage
        collectionName
        collectionImage
        totalPool
        bestOffer
        interest
        floorPriceSol
        ownedNfts {
          image
          mint
          name
          nftListIndex
          symbol
        }
      }
    }
  }
`

export const GET_ORDER_BOOK_ACTIVE = gql`
  query GetOrderBookActive($args: GetLoansArgs) {
    getLoans(args: $args) {
      offerCount
      activeCount
      totalOffers
      totalActive
      count
      data {
        orderBook {
          apy
          feePermillicentage
        }
        duration
        principalLamports
        totalOwedLamports
        start
        state
      }
    }
  }
`
export const GET_ORDER_BOOK_OFFERS = gql`
  query GetOrderBookOffers($args: GetLoansArgs) {
    getLoans(args: $args) {
      offerCount
      activeCount
      totalOffers
      totalActive
      data {
        principalLamports
        offerTime
      }
    }
  }
`

export const GET_BEST_OFFER_FOR_BORROW = gql`
  query GetBestOfferForBorrow($args: GetLoansArgs) {
    getLoans(args: $args) {
      data {
        duration
        principalLamports
        pubKey
      }
    }
  }
`

export const GENERATE_DISCORD_URL = gql`
  query GenerateDiscordUrl {
    generateDiscordUrl
  }
`
export const GET_PASSWORD_RESET = gql`
  query Query($email: String!) {
    getPasswordResetUrl(email: $email)
  }
`
