// Add custom Cypress commands here if needed
Cypress.Commands.add('login', (username, password) => {
    cy.session([username, password], () => {
      cy.visit('/login')
      cy.get('input[name="username"]').type(username)
      cy.get('input[name="password"]').type(password)
      cy.get('button[type="submit"]').click()
      cy.url().should('include', '/dashboard')
    })
})
