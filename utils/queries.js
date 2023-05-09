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

export const MY_HISTORICAL_OFFERS = gql`
  query GetHistoricalLoansByUser($lender: String, $borrower: String) {
    getHistoricalLoansByUser(lender: $lender, borrower: $borrower) {
      offerBlocktime
      cancelBlocktime
      takenBlocktime
      repayBlocktime
      defaultBlocktime
      extendBlocktime
      orderBook
      loan
      newLoan
      amountOffered
      lender
      borrower
      collateralMint
      helloMoonCollectionId
      tokenMint
      amountTaken
      loanDurationSeconds
      amountRepayed
      isRepayEscrow
      isDefaultEscrow
      offerInterest
      apy
      collectionName
      collectionImage
      status
      remainingDays
      foreclosedElapsedTime
      repayElapsedTime
      borrowInterest
      daysPercentProgress
    }
  }
`

export const LOAN_SUMMARY = gql`
  query GetLoanSummary(
    $borrower: String
    $lender: String
    $paginationToken: String
  ) {
    getLoanSummary(
      borrower: $borrower
      lender: $lender
      paginationToken: $paginationToken
    ) {
      data {
        offerBlocktime
        cancelBlocktime
        takenBlocktime
        repayBlocktime
        repayElapsedTime
        foreclosedElapsedTime
        canceledElapsedTime
        defaultBlocktime
        extendBlocktime
        remainingDays
        daysPercentProgress
        orderBook
        loan
        newLoan
        amountOffered
        lender
        status
        borrower
        collateralMint
        collateralName
        collectionName
        collectionImage
        helloMoonCollectionId
        tokenMint
        amountTaken
        offerInterest
        borrowInterest
        apy
        loanDurationSeconds
        amountRepayed
        isRepayEscrow
        isDefaultEscrow
      }
      paginationToken
    }
  }
`

export const MY_LOANS = gql`
  query MyLoans($args: GetLoansArgs) {
    getLoans(args: $args) {
      count
      data {
        duration
        pubKey
        principalLamports
        totalOwedLamports
        nftCollateralMint
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
        start
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

export const RESEND_EMAIL_CONFIRMATION = gql`
  query Query($email: String!) {
    resendEmailConfirmation(email: $email)
  }
`

export const GET_USER_PORTFOLIO = gql`
  query GetUserPortfolioCoins {
    getUserPortfolioCoins {
      holdings
      id
      name
      symbol
      walletName
    }
  }
`

export const GET_USER_PORTFOLIO_BY_SYMBOL = gql`
  query GetUserPortfolioCoinsBySymbol($symbol: String!) {
    getUserPortfolioCoinsBySymbol(symbol: $symbol) {
      holdings
      id
      name
      symbol
      walletName
    }
  }
`
