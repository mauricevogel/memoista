describe('Register Accounts', () => {
  it('should register a new user and redirect to home', () => {
    cy.visit('http://localhost:3000/auth/register')

    cy.get('input[name="username"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('test-password')
    cy.get('input[name="passwordConfirmation"]').type('test-password')

    cy.intercept('POST', `/api/auth/register`, {
      statusCode: 201
    }).as('registerRequest')
    cy.get('button[type="submit"]').click()

    cy.wait('@registerRequest').then(() => {
      cy.location('pathname').should('eq', '/')
    })
  })
})
