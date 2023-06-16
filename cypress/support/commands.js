Cypress.Commands.add('login', (email, password) => {
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('form').submit()
})
