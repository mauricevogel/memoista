describe('Login User', () => {
  it('should register a new user and redirect to home', () => {
    cy.visit('http://localhost:3000/auth/login')

    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('test-password')

    cy.task('mockServer', {
      interceptUrl: `http://localhost:8080/api/auth/sigin`,
      fixture: 'login_success.json'
    })

    cy.get('button[type="submit"]').click()

    cy.location('pathname').should('eq', '/')
    cy.contains('Go to app')
  })
})
