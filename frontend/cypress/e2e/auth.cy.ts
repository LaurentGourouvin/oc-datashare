/// <reference types="cypress" />

describe('Authentication', () => {
    it('should register a new account', () => {
        cy.visit('/register');
        cy.get('#email').type('test@datashare.fr');
        cy.get('#password').type('motdepasse123');
        cy.get('#confirmPassword').type('motdepasse123');
        cy.get('button[type="submit"]').click();
    });

    it('should show error when passwords do not match', () => {
        cy.visit('/register');
        cy.get('#email').type('test@datashare.fr');
        cy.get('#password').type('motdepasse123');
        cy.get('#confirmPassword').type('autremotdepasse');
        cy.get('button[type="submit"]').click();
        cy.get('[role="alert"]').should('be.visible');
    });

    it('should login with valid credentials', () => {
        cy.visit('/login');
        cy.get('#email').type('test@datashare.fr');
        cy.get('#password').type('motdepasse123');
        cy.get('button[type="submit"]').click();
    });

    it('should show error with invalid credentials', () => {
        cy.visit('/login');
        cy.get('#email').type('wrong@datashare.fr');
        cy.get('#password').type('wrongpassword');
        cy.get('button[type="submit"]').click();
        cy.get('[role="alert"]').should('be.visible');
    });
});