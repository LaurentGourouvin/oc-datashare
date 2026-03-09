/// <reference types="cypress" />

describe('Upload', () => {
    beforeEach(() => {
        localStorage.setItem('auth_token', 'fake-token');
    });

    it('should display upload card on arrival', () => {
        cy.visit('/upload');
        cy.get('.upload__card').should('be.visible');
        cy.get('.upload__title').should('contain', 'Ajouter un fichier');
    });

    it('should show file info after file selection', () => {
        cy.visit('/upload');
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-file.pdf', { force: true });
        cy.get('.upload__file-name').should('contain', 'test-file.pdf');
    });

    it('should show success state after upload', () => {
        cy.intercept('POST', '**/files/upload', {
            body: {
                token: 'new-token',
                originalName: 'test-file.pdf',
                size: 1024,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            }
        }).as('upload');
        cy.visit('/upload');
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-file.pdf', { force: true });
        cy.get('.upload__submit-btn').click();
        cy.wait('@upload');
        cy.get('.upload__success-text').should('be.visible');
    });

    it('should redirect to login if not authenticated', () => {
        localStorage.removeItem('auth_token');
        cy.visit('/upload');
        cy.url().should('include', '/login');
    });
});