describe('User login & signup', () => {
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
    })
  })

  context('Login', () => {
    it('Shows empty fields error', () => {
      cy.get('form').submit()
      cy.contains('Please fill up all fields')
    })

    it('Shows invalid email error', () => {
      cy.get('input[type="email"]').type('invalidEmail')
      cy.get('input[type="password"]').type(password)
      cy.get('form').submit()
      cy.contains('Please use a valid email')
    })
    it('Logs in successfully', () => {
      cy.login(email, password)
      cy.wait('@gqlLogin')
    })
  })

  context('Logout', () => {
    it('Logs out successfully', () => {
      cy.login(email, password)
      cy.get('button#btn-hamburger').click()
      cy.get('.profile-info').click()
      cy.get('button').contains('Logout').click()
    })
  })
})
