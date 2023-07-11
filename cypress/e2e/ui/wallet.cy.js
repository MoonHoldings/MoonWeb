describe('Wallet', () => {
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
              accessToken: 'testAccessToken',
              __typename: 'User',
            },
          },
        })
      }
      if (
        body.hasOwnProperty('operationName') &&
        body.operationName === 'Mutation' &&
        req.body.query.includes('logout')
      ) {
        req.alias = 'gqlLogout'
        req.reply({
          data: {
            logout: {},
          },
        })
      }

      if (
        body.hasOwnProperty('operationName') &&
        body.operationName === 'GetUserDashboard'
      ) {
        req.alias = 'gqlDashboard'

        req.reply({
          data: {
            getUserDashboard: {
              crypto: {
                total: 1584021,
                percentChange: 87,
                __typename: 'UserDashboardData',
              },
              nft: {
                total: 20258,
                percentChange: 47,
                __typename: 'UserDashboardData',
              },
              loan: {
                total: 0,
                percentChange: 0,
                __typename: 'UserDashboardData',
              },
              borrow: {
                total: 0,
                percentChange: 0,
                __typename: 'UserDashboardData',
              },
              percentChangeTotal: 134,
              __typename: 'UserDashboardResponse',
            },
          },
        })
      }

      if (
        req.body.operationName === 'Mutation' &&
        req.body.query.includes('removeAllUserWallets')
      ) {
        req.alias = 'gqlRemoveAllWallets'
        req.reply({
          data: {
            removeAllUserWallets: true,
          },
        })
      }

      if (req.body.operationName === 'AddUserWallet') {
        req.alias = 'gqlAddWallet'
        req.reply({
          data: {
            addUserWallet: true,
          },
        })
      }

      if (
        req.body.operationName === 'GetUserWallets' &&
        req.body.variables.type === 'Auto'
      ) {
        req.alias = 'gqlGetWallet'
        req.reply({
          data: {
            getUserWallets: [
              {
                id: '64',
                address: testWalletAddress,
                verified: true,
                name: null,
                __typename: 'UserWallet',
              },
              // add more wallet objects if needed
            ],
          },
        })
      }
    })
  })

  it('should add a solana wallet', () => {
    cy.login(email, password)
    cy.get('button#btn-wallet-mobile').click()
    cy.get('button').contains('Add Wallet Address').click()
    cy.get('div.search').type(testWalletAddress)
    cy.get('button#btn-add-wallet').click()
    cy.wait('@gqlGetWallet')
    cy.get('ul.all-wallets').contains('3bpET').should('exist')
  })
})
