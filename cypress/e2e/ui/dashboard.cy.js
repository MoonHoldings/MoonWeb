describe('Dashboard', () => {
  const baseUrl = 'http://localhost:3000'
  const apiGraphQL = 'http://localhost/graphql'
  const email = 'test@email.com'
  const password = 'testPassword'

  beforeEach(() => {
    cy.visit(`${baseUrl}/login`)
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
              __typename: 'User',
            },
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
                total: 10,
                percentChange: -90,
                __typename: 'UserDashboardData',
              },
              nft: {
                total: 0,
                percentChange: -100,
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
              percentChangeTotal: -100,
              __typename: 'UserDashboardResponse',
            },
          },
        })
      }
    })
    cy.setCookie('aid', 'test-cookie')
  })

  it('Working page links', () => {
    cy.login(email, password)
    cy.url().should('eq', `${baseUrl}/dashboard`)

    cy.get('button#btn-hamburger').click()
    cy.get('button').contains('Dashboard').click()
    cy.location('pathname').should('eq', '/dashboard')

    cy.get('button#btn-hamburger').click()
    cy.get('button').contains('Crypto').click()
    cy.location('pathname').should('eq', '/crypto')
    cy.visit(`${baseUrl}/dashboard`)

    cy.get('button#btn-hamburger').click()
    cy.get('button').contains('NFTs').click()
    cy.location('pathname').should('eq', '/nfts')
    cy.visit(`${baseUrl}/dashboard`)

    cy.get('button#btn-hamburger').click()
    cy.get('button').contains('Lend & Borrow').click()
    cy.location('pathname').should('eq', '/defi-loans/lend')
    cy.visit(`${baseUrl}/dashboard`)
  })

  it('Functional coin search', () => {
    cy.login(email, password)
    cy.get('button#btn-wallet-mobile').click()
    cy.get('label').get('input').click().as('coinSearch')

    cy.contains('ALGO - Algorand').should('be.visible')

    cy.get('@coinSearch').type('BTC')
    cy.contains('BTC - Bitcoin').should('be.visible')
  })
})
