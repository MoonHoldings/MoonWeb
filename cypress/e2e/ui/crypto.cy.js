describe('Crypto Portfolio', () => {
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

      if (
        req.body.operationName === 'Query' &&
        req.body.query.includes('getUserPortfolioCoins')
      ) {
        req.alias = 'gqlGetPortfolioCoins'
        req.reply({
          data: {
            getUserPortfolioCoins: [
              {
                holdings: 80210.568,
                id: '157',
                name: 'Solana',
                symbol: 'SOL',
                verified: false,
                walletAddress: testWalletAddress,
                walletName: null,
                walletId: null,
                price: '21.28',
                isConnected: true,
                __typename: 'Coin',
              },
              {
                holdings: 381,
                id: '244',
                name: 'USD Coin',
                symbol: 'USDC',
                verified: false,
                walletAddress: testWalletAddress,
                walletName: null,
                walletId: null,
                price: '1.00',
                isConnected: true,
                __typename: 'Coin',
              },
            ],
          },
        })
      }

      if (req.body.operationName === 'GetUserPortfolioTotalByType') {
        req.alias = 'gqlGetPortfolioTotal'
        req.reply({
          data: { getUserPortfolioTotalByType: 80591.568 },
        })
      }
    })
  })

  it('crypto portfolio should display users balances', () => {
    cy.login(email, password)
    cy.get('button#btn-hamburger').click()
    cy.get('button').contains('Crypto').click()
    cy.location('pathname').should('eq', '/crypto')
    cy.get('button')
      .get('div')
      .get('span')
      .contains('Solana')
      .should('be.visible')
    cy.get('button')
      .get('div')
      .get('span')
      .contains('USD Coin')
      .should('be.visible')
    cy.get('button').get('div').get('h1').contains('80k').should('be.visible')
    cy.get('button').get('div').get('h1').contains('381').should('be.visible')
  })
})
