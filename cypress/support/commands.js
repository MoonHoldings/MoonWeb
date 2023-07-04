Cypress.Commands.add('login', (email, password) => {
  cy.visit('http://localhost:3000/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('form').submit()
  cy.location('pathname').should('eq', '/dashboard')
})
