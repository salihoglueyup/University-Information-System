import './commands'
// Globally handle uncaught exceptions during tests so they don't break the build
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})
