describe('My account page delete account', () => {
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.visit('/myaccount')
        cy.contains('button', 'Delete account').click()
    })

    it('opens change password form', () => {
        cy.contains('h3', 'Delete your account')
    })

    it('closes change password form', () => {
        cy.contains('h3', 'Delete your account')
        cy.contains('button', 'Cancel').click()
        cy.contains('h3', 'Delete your account').should('not.exist')
    })
    
    it('requires password', () => {
        cy.get('[data-cy=delete]').click()
      
    })

    it('requires valid password', () => {
        cy.get('[data-cy=password]').type('salasan')
        cy.get('[data-cy=delete]').click()
        cy.get('[data-cy=negative]').should('contain', 'Invalid token, id or password')
    })

    it('deletes account', () => {
        cy.get('[data-cy=password]').type('salasana')
        cy.get('[data-cy=delete]').click()
        cy.url().should('eq', 'http://localhost:3000/login')
        cy.contains('h3', 'Log In').should('exist')
    })
})