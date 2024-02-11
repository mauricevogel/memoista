describe('Register Accounts', () => {
  it('should register a new user and redirect to home', () => {
    cy.visit('http://localhost:3000/auth/register')

    cy.get('input[name="username"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('test-password')
    cy.get('input[name="passwordConfirmation"]').type('test-password')

    cy.task('mockServer', {
      interceptUrl: `http://localhost:8080/api/auth/register`,
      fixture: 'empty.json'
    })

    cy.get('button[type="submit"]').click()

    cy.location('pathname').should('eq', '/')
    cy.contains('Account created')
    cy.contains(
      'Please check your email on information on how to confirm and activate your account!'
    )
  })
})
