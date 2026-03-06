/// <reference types="cypress" />

describe('Download', () => {
    it('should display file metadata with valid token', () => {
        cy.intercept('GET', '**/files/metadata/**', { fixture: 'file-metadata.json' }).as('getMetadata');
        cy.visit('/download/fake-token');
        cy.wait('@getMetadata');
        cy.get('.download__file-name').should('contain', 'test-document.pdf');
        cy.get('.download__file-size').should('contain', '2.6 Mo');
    });

    it('should display info callout when file expires in 3 days', () => {
        cy.intercept('GET', '**/files/metadata/**', { fixture: 'file-metadata.json' }).as('getMetadata');
        cy.visit('/download/fake-token');
        cy.wait('@getMetadata');
        cy.get('[role="alert"]').should('be.visible');
    });

    it('should show error callout with invalid token', () => {
        cy.intercept('GET', '**/files/metadata/**', { statusCode: 404 }).as('getMetadata');
        cy.visit('/download/token-invalide');
        cy.wait('@getMetadata');
        cy.get('[role="alert"]').should('be.visible');
    });

    it('should not display download button if file is expired', () => {
        cy.intercept('GET', '**/files/metadata/**', { fixture: 'file-metadata-expired.json' }).as('getMetadata');
        cy.visit('/download/token-expire');
        cy.wait('@getMetadata');
        cy.get('button[onClick]').should('not.exist');
    });
});