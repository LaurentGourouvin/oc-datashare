/// <reference types="cypress" />

const mockFiles = [
    {
        token: 'token-1',
        originalName: 'IMG_9210.jpg',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        isExpired: false,
        hasPassword: false,
    },
    {
        token: 'token-2',
        originalName: 'compo2.mp3',
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        isExpired: false,
        hasPassword: false,
    },
    {
        token: 'token-3',
        originalName: 'vacances_ardeche.mp4',
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isExpired: true,
        hasPassword: false,
    },
];

describe('Dashboard', () => {
    beforeEach(() => {
        localStorage.setItem('auth_token', 'fake-token');
        cy.intercept('GET', '**/files/history', { body: { data: mockFiles } }).as('getHistory');
    });

    it('should display file list', () => {
        cy.visit('/dashboard');
        cy.wait('@getHistory');
        cy.get('.dashboard__item').should('have.length', 3);
    });

    it('should filter active files', () => {
        cy.visit('/dashboard');
        cy.wait('@getHistory');
        cy.get('.dashboard__filter').contains('Actifs').click();
        cy.get('.dashboard__item').should('have.length', 2);
    });

    it('should filter expired files', () => {
        cy.visit('/dashboard');
        cy.wait('@getHistory');
        cy.get('.dashboard__filter').contains('Expiré').click();
        cy.get('.dashboard__item').should('have.length', 1);
    });

    it('should delete a file', () => {
        cy.intercept('DELETE', '**/files/**', { statusCode: 200 }).as('deleteFile');
        cy.visit('/dashboard');
        cy.wait('@getHistory');
        cy.get('.dashboard__btn-delete').first().click();
        cy.get('.dashboard__item').should('have.length', 2);
    });

    it('should redirect to login if not authenticated', () => {
        localStorage.removeItem('auth_token');
        cy.visit('/dashboard');
        cy.url().should('include', '/login');
    });
});