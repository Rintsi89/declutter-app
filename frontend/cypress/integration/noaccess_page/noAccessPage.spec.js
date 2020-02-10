describe('No Access Page', () => { 
    beforeEach(() => {
        cy.resetDataBase()
        cy.visit('http://localhost:3000/reset/isdsdsdl121234234') // This is invalid token
    })

    it('shows when reset password token does not exists', () => {
        cy.contains('h1', 'Access Denied!')
    })

    it('has link to login page', () => {
        cy.get('[data-cy=buttonlink]').click()
        cy.url().should('eq', 'http://localhost:3000/login')
    })

})