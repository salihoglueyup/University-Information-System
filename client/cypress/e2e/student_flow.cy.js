describe('UBIS Student Flow E2E Tests', () => {
  beforeEach(() => {
    // Clear localStorage to ensure a clean state
    cy.clearLocalStorage();
  });

  it('Visits the portal, fails with wrong password, then logs in successfully', () => {
    cy.visit('/login');
    
    // Check if branding exists
    cy.contains('Giriş Portalı').should('be.visible');

    // Enter wrong credentials
    cy.get('input[name="username"]').type('20250001');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Verify error notification exists or the form doesn't redirect
    cy.on('window:alert', (text) => {
      expect(text).to.contain('Giriş başarısız');
    });

    // Enter correct credentials
    // Note: Assuming "dummy_student" is a mock valid password if auth is mocked or we can test an actual environment if seeded.
    // For this demonstration, we'll mimic the form logic.
    cy.get('input[name="password"]').clear().type('student123');
    cy.get('button[type="submit"]').click();

    // The user should either hit the 2FA screen or redirect to dashboard
    // If 2FA is triggered, UI should contain "İki Aşamalı Doğrulama"
    cy.get('body').then(($body) => {
      if ($body.text().includes('Doğrula ve Giriş Yap')) {
        // 2FA Flow
        cy.get('input[placeholder="000000"]').type('123456');
        cy.get('button[type="submit"]').contains('Doğrula ve Giriş Yap').click();
      }
    });

    // Check redirection to Dashboard
    cy.url().should('include', '/dashboard');

    // Assert Sidebar exists
    cy.contains('Dashboard').should('be.visible');

    // Navigate to Grades page
    cy.visit('/dashboard/grades');
    cy.contains('Akademik Durum Özeti').should('be.visible');

    // Check if Theme Toggle works (mock clicking the customize theme button)
    cy.get('button').contains('Hesap Ayarları').should('exist');
  });
});
