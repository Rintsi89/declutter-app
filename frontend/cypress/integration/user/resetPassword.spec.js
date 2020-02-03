describe('Register', () => {

    before(() => {
        cy.resetDataBase()
        cy.initUser()
    })

    beforeEach(() => {
        cy.visit('/')
        cy.contains('button', 'Reset password').click()
    })

    it('is on the right page', () => {
        cy.contains('h3', 'Reset password')
    })

    it('has log in button', () => {
        cy.contains('button', 'Log in')
    })

    it('has create account button', () => {
        cy.contains('button', 'Create account')
    })

    it('requires email', () => {
        cy.get('[data-cy=email]').type('{enter}')
        cy.get('[data-cy=negative]').should('contain', 'Email can\'t be blank')
    })

    it('rejects non-existing email', () => {
        cy.get('[data-cy=email]').type('123@123{enter}')
        cy.get('[data-cy=negative]').should('contain', 'No user found related to this email address')
    })

    it('accepts correct email', () => {
        cy.get('[data-cy=email]').type('testUser@testUser.com{enter}')
        cy.get('[data-cy=positive]').should('contain', 'Link to reset your password has been send to testUser@testUser.com')
    })
})