describe('Lend & Borrow', () => {
  const baseUrl = 'http://localhost:3000'
  const apiGraphQL = 'http://localhost/graphql'
  const email = 'test@email.com'
  const password = 'testPassword'
  const testWalletAddress = '3bpETYgcq63kWs86BEnWM4QiBUisfP8BrmjHYGjsHL11'

  beforeEach(() => {
    cy.intercept('POST', apiGraphQL, (req) => {
      const { body } = req
      if (
        body.hasOwnProperty('operationName') &&
        body.operationName === 'Mutation' &&
        req.body.query.includes('login')
      ) {
        req.alias = 'gqlLogin'
        req.reply({
          data: {
            login: {
              username: 'testUser',
              accessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWx2YXJlem1pY29oQGdtYWlsLmNvbSIsImlhdCI6MTY4Njg0MzQ1OSwiZXhwIjoxNjg5NDM1NDU5fQ.x9NMt-4kNHn02BzjgZCJe0m5XO992P2o-7PCt4kWduc',
              __typename: 'User',
            },
          },
        })
      }
      if (req.body.operationName === 'GetOrderBookActive') {
        req.alias = 'gqlGetOrderBookActive'
        req.reply({
          data: {
            getLoans: {
              offerCount: null,
              activeCount: null,
              totalOffers: null,
              totalActive: null,
              count: 23605,
              data: [
                {
                  orderBook: {
                    apy: 122344,
                    feePermillicentage: 16000,
                    __typename: 'OrderBook',
                  },
                  duration: 604800,
                  principalLamports: 3510000000,
                  totalOwedLamports: 3593329716,
                  start: 1689032754,
                  state: 'taken',
                  __typename: 'Loan',
                },
                {
                  orderBook: {
                    apy: 122344,
                    feePermillicentage: 16000,
                    __typename: 'OrderBook',
                  },
                  duration: 604800,
                  principalLamports: 3510000000,
                  totalOwedLamports: 3593329716,
                  start: 1689032754,
                  state: 'taken',
                  __typename: 'Loan',
                },
                {
                  orderBook: {
                    apy: 122344,
                    feePermillicentage: 16000,
                    __typename: 'OrderBook',
                  },
                  duration: 604800,
                  principalLamports: 3510000000,
                  totalOwedLamports: 3593329716,
                  start: 1689032754,
                  state: 'taken',
                  __typename: 'Loan',
                },
                {
                  orderBook: {
                    apy: 122344,
                    feePermillicentage: 16000,
                    __typename: 'OrderBook',
                  },
                  duration: 604800,
                  principalLamports: 3510000000,
                  totalOwedLamports: 3593329716,
                  start: 1689032754,
                  state: 'taken',
                  __typename: 'Loan',
                },
                {
                  orderBook: {
                    apy: 122344,
                    feePermillicentage: 16000,
                    __typename: 'OrderBook',
                  },
                  duration: 604800,
                  principalLamports: 3530000000,
                  totalOwedLamports: 3613804529,
                  start: 1689032754,
                  state: 'taken',
                  __typename: 'Loan',
                },
              ],
              __typename: 'PaginatedLoanResponse',
            },
          },
        })
      }

      if (req.body.operationName === 'GetOrderBookOffers') {
        req.alias = 'gqlGetOrderBookOffers'
        req.reply({
          data: {
            getLoans: {
              offerCount: null,
              activeCount: null,
              totalOffers: null,
              totalActive: null,
              data: [
                {
                  principalLamports: 800020000000,
                  offerTime: 1689026923,
                  __typename: 'Loan',
                },
                {
                  principalLamports: 656000000000,
                  offerTime: 1689026938,
                  __typename: 'Loan',
                },
                {
                  principalLamports: 655000000000,
                  offerTime: 1689014406,
                  __typename: 'Loan',
                },
                {
                  principalLamports: 650000000000,
                  offerTime: 1689001688,
                  __typename: 'Loan',
                },
                {
                  principalLamports: 440000000000,
                  offerTime: 1681927474,
                  __typename: 'Loan',
                },
              ],
              __typename: 'PaginatedLoanResponse',
            },
          },
        })
      }

      if (req.body.operationName === 'GetOrderBooks') {
        req.alias = 'gqlGetOrderBooks'
        req.reply({
          data: {
            getOrderBooks: {
              count: 451,
              data: [
                {
                  id: 57,
                  pubKey: 'test',
                  duration: 604800,
                  apy: 138179,
                  apyAfterFee: 220,
                  feePermillicentage: 16000,
                  collectionName: 'Mad Lads',
                  collectionImage:
                    'https://sharky.fi/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FMad%20Lads.b9eb7c8d.jpg&w=128&q=75',
                  totalPool: 7081.09,
                  bestOffer: 70.43,
                  interest: null,
                  floorPriceSol: 61.9999,
                  ownedNfts: null,
                  __typename: 'OrderBookList',
                },
              ],
              __typename: 'PaginatedOrderBookResponse',
            },
          },
        })
      }

      if (req.body.operationName === 'MyOffers') {
        req.alias = 'gqlMyOffers'
        req.reply({
          data: {
            getLoans: {
              count: 0,
              data: [],
              __typename: 'PaginatedLoanResponse',
            },
          },
        })
      }

      if (req.body.operationName === 'MyLoans') {
        req.alias = 'gqlMyLoans'
        req.reply({
          data: {
            getLoans: {
              count: 0,
              data: [],
              __typename: 'PaginatedLoanResponse',
            },
          },
        })
      }

      if (req.body.operationName === 'GetHistoricalLoansByUser') {
        req.alias = 'gqlGetHistoricalLoansByUser'
        req.reply({
          data: {
            getHistoricalLoansByUser: [
              {
                offerBlocktime: 1686800492,
                cancelBlocktime: null,
                takenBlocktime: 1686805057,
                repayBlocktime: null,
                defaultBlocktime: null,
                extendBlocktime: 1687222044,
                orderBook: 'test',
                loan: 'test',
                newLoan: 'test',
                amountOffered: 0.2,
                lender: 'test',
                borrower: 'test',
                collateralMint: 'test',
                helloMoonCollectionId: 'test',
                tokenMint: 'test',
                amountTaken: 0.2,
                loanDurationSeconds: 604800,
                amountRepayed: null,
                isRepayEscrow: null,
                isDefaultEscrow: null,
                offerInterest: 0.0042585515380176965,
                apy: 200,
                collectionName: 'MoonHolders',
                collectionImage:
                  'https://sharky.fi/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FMoonHolders.10dd0302.jpg&w=128&q=75',
                status: 'Repaid',
                remainingDays: -14,
                foreclosedElapsedTime: null,
                repayElapsedTime: '20 D ago',
                borrowInterest: 0.0050697042119258184,
                daysPercentProgress: null,
                __typename: 'HistoricalLoanResponse',
              },
            ],
          },
        })
      }

      if (req.body.operationName === 'GetTotalLendsByAddress') {
        req.alias = 'gqlGetTotalLendsByAddress'
        req.reply({
          data: {
            getTotalLendsByAddress: {
              total: 0.2,
              totalActive: 0,
              interest: 0.0042585515380176965,
              activeInterest: 0,
              foreclosureRate: 0,
              __typename: 'TotalLoanResponse',
            },
          },
        })
      }

      if (req.body.operationName === 'GetTotalBorrowsByAddress') {
        req.alias = 'gqlGetTotalBorrowsByAddress'
        req.reply({
          data: {
            getTotalBorrowsByAddress: {
              total: 0,
              interest: 0,
              __typename: 'TotalLoanResponse',
            },
          },
        })
      }
    })
  })

  it('Checks nft collection', () => {
    cy.login(email, password)
    cy.get('button#btn-hamburger').click()
    cy.get('button').contains('Lend & Borrow').click()
    cy.location('pathname').should('eq', '/defi-loans/lend')
    cy.get('div').contains('Mad Lads').should('exist').click()
    cy.get('div').contains('Active Lenders').should('exist')
    cy.get('div').contains('Taken').should('exist')
    cy.get('div').contains('Active Offers ').should('exist')
    cy.get('div').contains('Offer Made').should('exist')
  })
})
